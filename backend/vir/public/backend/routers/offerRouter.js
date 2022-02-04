const express = require('express');
const router = express.Router();
const Offer = require("../models/offer").model;
const authentication = require('../lib/authentication');
const errorHandler = require('../lib/errorHandler');

const requiredAuthLevel = authentication.authLevel.employee;

router.get('/', async (req, res) => {
    try {
        let query = {}
        
        let offers = (await Offer.find(query));

        res.status(200).json(offers);
    } catch (error) {
        return await errorHandler.handle(error, res, 500);
    }
})

router.post('/', authentication.verifyAuth(requiredAuthLevel, false), async (req, res) => {
    let offer = null;
    try {
        offer = await Offer(req.body);
    } catch (error) {
        return await errorHandler.handle(error, res, 400);
    }

    try {
        const newOffer = await offer.save();
        res.status(201).json(newOffer);
    } catch (error) {
        return await errorHandler.handle(error, res);
    }
})

router.get('/:id', getOfferById, async (req, res) => {
    try {
        res.json(res.offer);
    } catch (error) {
        return await errorHandler.handle(error, res, 500);
    }
})

router.delete('/:id', authentication.verifyAuth(requiredAuthLevel, false), getOfferById, async (req, res) => {
    try {
        let removedOffer = res.offer;
        await res.offer.remove();

        res.status(200).json(removedOffer);
    } catch (error) {
        return await errorHandler.handle(error, res, 500);
    }
})

router.patch('/:id', authentication.verifyAuth(requiredAuthLevel, false), getOfferById, async (req, res) => {
    try {
        res.offer.set(req.body);
        await res.offer.save();

        res.status(200).json(res.offer);
    } catch (error) {
        return await errorHandler.handle(error, res, 400);
    }
})

async function getOfferById(req, res, next) {
    let offer;
    try {
        offer = await Offer.findById(req.params.id);

        if (offer == null) {
            const errmsg = "Offer with id " + req.params.id + " not found on the database";
            return await errorHandler.handleMsg(errmsg, res, 404);
        }
    } catch (error) {
        return await errorHandler.handle(error, res);
    }

    res.offer = offer;
    next();
}

module.exports = router;
