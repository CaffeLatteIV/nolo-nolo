const express = require('express');
const router = express.Router();
const Customer = require('../models/customer').model;
const Rental = require('../models/rental')
const Product = require('../models/product').model;
const Unit = require('../models/unit').model;
const authentication = require('../lib/authentication');
const errorHandler = require('../lib/errorHandler');
const path = require('path');
const paginate = require('../lib/pagination').paginate;
const { deleteFile, getRandomNameForImage} = require('../lib/helper');

const imageFolderRelativePath = global.profileImageDirRelative;
const imageFolderAbsolutePath = global.profileImageDir;

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imageFolderAbsolutePath)
    },
    filename: function (req, file, cb) {
        cb(null, getRandomNameForImage("customer", path.extname(file.originalname)))
    }
})
const upload = multer({ storage: storage })

const requiredAuthLevel = authentication.authLevel.employee;


router.get('/', authentication.verifyAuth(requiredAuthLevel, false), async (req, res) => {
    try {
        let query = {}
        if (req.query.username)
            query["loginInfo.username"] = req.query.username;
        if (req.query.email)
            query["loginInfo.email"] = req.query.email;

        let customers = await Customer.find(query)
        
        if (req.query.nameStartWith){
            const startWith = req.query.nameStartWith.toLowerCase();
            customers = customers.filter(c => {
                return `${c.firstname} ${c.lastname}`.toLowerCase().includes(startWith) ||  `${c.lastname} ${c.firstname}`.toLowerCase().includes(startWith)
            })
        }

        res.status(200).json(paginate(customers, req.query));
    } catch (error) {
        return await errorHandler.handle(error, res, 500);
    }
})

router.post('/', upload.single('profilePicture'), authentication.hashPassword, async (req, res) => {
    let customer = null;
    let jwtToken = null;
    try {
        if(req.file)
            req.body.profilePicture = path.join(imageFolderRelativePath, req.file.filename).substring(1);

        customer = await Customer(req.body);
        jwtToken = await customer.generateToken();
    } catch (error) {
        return await errorHandler.handle(error, res, 400);
    }

    try {
        const newCustomer = await customer.save();
        res.status(201).set({ "Authorization": jwtToken }).json(newCustomer);
    } catch (error) {
        try{
            if(req.file)
                await deleteFile(path.join(global.publicDir, customer.profilePicture));
        } catch (error) {
            return await errorHandler.handle(error, res, 500);
        }
        return await errorHandler.handle(error, res);
    }
})

router.get('/:id', authentication.verifyAuth(requiredAuthLevel, true), getCustomerById, async (req, res) => {
    res.json(res.customer);
})

router.delete('/:id', authentication.verifyAuth(requiredAuthLevel, true), getCustomerById, async (req, res) => {
    try {
        let removedCustomer = res.customer;
        await res.customer.remove();

        
        if(removedCustomer.image && removedCustomer.image != global.profileImagePlaceholderName)
            await deleteFile(path.join(global.publicDir, removedCustomer.profilePicture));

        res.status(200).json(removedCustomer);   //{message: "Customer deleted from the database"});
    } catch (error) {
        return await errorHandler.handle(error, res, 500);
    }
})

router.patch('/:id', authentication.verifyAuth(requiredAuthLevel, true), authentication.hashPassword, getCustomerById, async (req, res) => {
    try {
        res.customer.set(req.body);
        await res.customer.save();

        res.status(200).json(res.customer);
    } catch (error) {
        return await errorHandler.handle(error, res, 400);          //Non so se restituire 400 o 404
    }
})

router.get('/:id/rentals', authentication.verifyAuth(requiredAuthLevel, true), getCustomerById, async (req, res) => {
    try {
        let rentals = await Rental.find({ customer: req.params.id })

        if(req.query.populate && JSON.parse(req.query.populate)) {
            rentals = await rentals.mapAsync(async(r) => await r.populateAll())
        }

        res.status(200).json(paginate(rentals, req.query));
    } catch (error) {
        return await errorHandler.handle(error, res, 400);         //Non so se restituire 400 o 404
    }
})

router.get('/:id/favorites', authentication.verifyAuth(requiredAuthLevel, true), getCustomerById, async (req, res) => {
    let max = req.query.max;
    try {
        let rentals = await Rental.find({ customer: req.params.id })

        let map = new Map();
        for (const rental of rentals){
            let unit = await Unit.findById(rental.unit);
            let product = await Product.findById(unit.product)
            if (map.has(product))
                map.set(product, map.get(product) + 1);
            else
                map.set(product, 1);
        }

        let sortedMap = [...map.entries()].sort((a, b) => b[1] - a[1]);
        if (max)
            sortedMap = sortedMap.slice(0, max);

        let onlyProducts = sortedMap.map(x => x[0]);

        return res.status(200).json(onlyProducts)
    } catch (error) {
        return await errorHandler.handle(error, res, 400);         //Non so se restituire 400 o 404
    }
})

async function getCustomerById(req, res, next) {
    let customer;
    try {
        customer = await Customer.findById(req.params.id);

        if (customer == null) {
            const errmsg = "Customer with id " + req.params.id + " not found on the database";
            return await errorHandler.handleMsg(errmsg, res, 404);
        }
    } catch (error) {
        return await errorHandler.handle(error, res);
    }

    res.customer = customer;
    next();
}

module.exports = router;
