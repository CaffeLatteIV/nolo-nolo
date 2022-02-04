const express = require('express');
const Bill = require('../models/bill').model;
const Unit = require("../models/unit").model;
const Product = require("../models/product").model;
const Customer = require('../models/customer').model;
const priceCalculation = require('../lib/priceCalculation');
const Employee = require('../models/employee');
const router = express.Router();
const errorHandler = require('../lib/errorHandler');
const authentication = require('../lib/authentication');

const requiredAuthLevel = authentication.authLevel.admin

router.get('/', authentication.verifyAuth(requiredAuthLevel, true), async (req, res) => {
    try {
        let query = {}
        if(req.query.customer) {
            query.customer = req.query.customer;
        }
        if(req.query.employee) {
            query.employee = req.query.employee
        }

        let unit = (await Bill.find(query));

        res.status(200).json(unit);
    } catch (error) {
        return await errorHandler.handle(error, res, 500);
    }
})

router.post('/', authentication.verifyAuth(requiredAuthLevel, true), async (req, res) => {
    const {customer: customerID, employee: employeeID, startRent: from, endRent: to , unit: unitID} = req.body;
    const {expectedEndDate, repairDamageSurcharge} = req.query;

    let bill = null;
    try {
        const billObject = await generateBill(customerID, employeeID, from, to, unitID, expectedEndDate, repairDamageSurcharge);
        console.log(billObject);
    
        bill = await Bill(billObject);
    } catch (error) {
        return await errorHandler.handle(error, res, 400);
    }

    try {
        const newBill = await bill.save();
        res.status(201).json(newBill);
    } catch (error) {
        return await errorHandler.handle(error, res);
    }
})

router.get('/:id', authentication.verifyAuth(requiredAuthLevel, true), getBillById, async (req, res) => {
    res.json(res.bill);
})

router.delete('/:id', authentication.verifyAuth(requiredAuthLevel, false), getBillById, async (req, res) => {
    try{
        let removedBill = res.bill;
        await res.bill.remove();

        res.status(200).json(removedBill);
    } catch(error){
        return await errorHandler.handle(error, res, 500);
    }
})

router.patch('/:id', authentication.verifyAuth(requiredAuthLevel, false),getBillById, async (req,res) => {
    try {
        res.bill.set(req.body);
        await res.bill.save();

        res.status(200).json(res.bill);
    } catch (error) {
        return await errorHandler.handle(error, res, 400);
    }
})

async function generateBill(customerID, employeeID, from, to, unitID, expectedEndDate, repairDamageSurcharge) {
    const unit = await Unit.findById(unitID);

    const product = await Product.findById(unit.product);
    const category = product.category;
    const subcategory = product.subcategory;
    unit.price = product.price;

    console.log("UNIT: ", unit, "PRODUCT: ", product)

    from = new Date(from);
    to = new Date(to);

    expectedEndDate = new Date(expectedEndDate);
    repairDamageSurcharge = parseInt(repairDamageSurcharge);

    const priceEstimation = await priceCalculation.unitPriceEstimation(unit, { from, to, agentId: customerID, product, category, subcategory, expectedEndDate, repairDamageSurcharge });

    const billObject = {
        customer: customerID,
        employee: employeeID,
        priceRecap: priceEstimation,
        startRent: from,
        endRent: to,
    }

    return billObject;
}

async function getBillById(req, res, next) {
    let bill;
    try {
        bill = await Bill.findById(req.params.id);

        if (bill == null) {
            const errmsg = "Bill with id " + req.params.id + " not found on the database";
            return await errorHandler.handleMsg(errmsg, res, 404);
        }
    } catch (error) {
        return await errorHandler.handle(error, res);
    }

    res.bill = bill;
    next();
}

module.exports = router;