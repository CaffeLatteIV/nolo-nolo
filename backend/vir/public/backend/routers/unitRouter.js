const express = require('express');
const router = express.Router();
const Unit = require("../models/unit").model;
const unitConditionLevel = require("../models/unit").conditionLevel;
const Product = require("../models/product").model;
const authentication = require('../lib/authentication');
const errorHandler = require('../lib/errorHandler');
const priceCalculation = require('../lib/priceCalculation');

const requiredAuthLevel = authentication.authLevel.employee;

router.get('/', authentication.verifyAuth(requiredAuthLevel, false), async (req, res) => {
    try {
        let query = {}
        let unit = []
        if(req.query.project){ 
            const project = req.query.project.split(',');
            unit = await Unit.find(query, project);
        }
        else
            unit = (await Unit.find(query));

        if(req.query.populate && JSON.parse(req.query.populate)) {
            unit = await unit.mapAsync(async(u) => await u.populateAll())
        }

        res.status(200).json(unit);
    } catch (error) {
        return await errorHandler.handle(error, res, 500);
    }
})

router.get('/:idunit', authentication.verifyAuth(requiredAuthLevel, false), getUnitById, async (req, res) => {
    try {
        res.json(res.unit);
    } catch (error) {
        return await errorHandler.handle(error, res, 500);
    }
})

router.delete('/:idunit', authentication.verifyAuth(requiredAuthLevel, false), getUnitById, async (req, res) => {
    try {
        let removedUnit = res.unit;
        await res.unit.remove();

        res.status(200).json(removedUnit);
    } catch (error) {
        return await errorHandler.handle(error, res, 500);
    }
})

router.patch('/:idunit', authentication.verifyAuth(requiredAuthLevel, false), getUnitById, async (req, res) => {
    try {
        res.unit.set(req.body);
        await res.unit.save();

        res.status(200).json(res.unit);
    } catch (error) {
        return await errorHandler.handle(error, res, 400);
    }
})

router.get('/:idunit/priceEstimation', authentication.verifyAuth(requiredAuthLevel, false), authentication.getIdFromToken, getUnitById, async (req, res) => {
    try {
        if(res.unit.condition === unitConditionLevel.broken) {
            const errmsg = "You can't make price estimation on broken units";
            return await errorHandler.handleMsg(errmsg, res, 400);
        }

        let from = req.query.from || Date.now();
        let to = req.query.to;

        if (!to) {
            const errmsg = "The query parameters 'to' is required";
            return await errorHandler.handleMsg(errmsg, res, 400);
        }

        const product = await Product.findById(res.unit.product);
        const category = product.category;
        const subcategory = product.subcategory;

        res.unit.price = product.price;

        let agentId = req.agentId;
        from = new Date(from);
        to = new Date(to);
        
        let priceEstimation = await priceCalculation.unitPriceEstimation(res.unit, { from, to, agentId, product, category, subcategory });
        return res.status(200).json(priceEstimation);
    } catch (error) {
        return await errorHandler.handle(error, res, 500);
    }
})

async function getUnitById(req, res, next) {
    let unit;
    try {
        unit = await Unit.findById(req.params.idunit);

        if (unit == null) {
            const errmsg = "Unit with id " + req.params.id + " not found on the database";
            return await errorHandler.handleMsg(errmsg, res, 404);
        }
    } catch (error) {
        return await errorHandler.handle(error, res);
    }

    res.unit = unit;
    next();
}

module.exports = router;
