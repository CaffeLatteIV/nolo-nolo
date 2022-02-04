const express = require('express');
const router = express.Router();
const Product = require("../models/product").model;
const Unit = require("../models/unit").model;
const unitConditionLevel = require("../models/unit").conditionLevel;
const authentication = require('../lib/authentication');
const errorHandler = require('../lib/errorHandler');
const path = require('path')
const computePriceEstimation = require('../lib/priceCalculation').computePriceEstimation;
const paginate = require('../lib/pagination').paginate;
const { deleteFile } = require('../lib/helper');

const requiredAuthLevel = authentication.authLevel.employee;



const imageRelativePath = global.productImageDirRelative;
const imageAbsolutePath = global.productImageDir;

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imageAbsolutePath)
    },
    filename: function (req, file, cb) {
        const uniqueName = req.body.name + '-' + Date.now() + path.extname(file.originalname);
        cb(null, uniqueName)
    }
})
const upload = multer({ storage: storage })

router.get('/', async (req, res) => {
    try {
        let query = {}

        // BEFORE FIND QUERY
        if (req.query.name)
            query["name"] = req.query.name;
        if (req.query.category)
            query["category"] = req.query.category;
        if (req.query.subcategory)
            query["subcategory"] = req.query.subcategory;

        let product = (await Product.find(query));

        // AFTER FIND QUERY
        if(req.query.availableTo){
            const to = new Date(req.query.availableTo)
            const from = new Date(req.query.availableFrom) || Date.now();

            product = await product.filterAsync(async (x) => await x.availableFromTo(from,to))        
        } else if (req.query.available) {
            const bool = JSON.parse(req.query.available)
            if(bool)
                product = await product.filterAsync(async(x) => await x.available())
            else
                product = await product.filterAsync(async(x) => !(await x.available()))
        }

        // MODIFIER
        if(req.query.populate && JSON.parse(req.query.populate)) {            
            product = await product.mapAsync(async(p) => await p.populateAll())
        }

        res.status(200).json(paginate(product, req.query));
    } catch (error) {
        return await errorHandler.handle(error, res, 500);
    }
})

router.post('/', authentication.verifyAuth(requiredAuthLevel, false), upload.single('image'), async (req, res) => {
    let product = null;
    try {
        if (req.file)
            req.body.image = path.join(imageRelativePath, req.file.filename).substring(1);
        product = await Product(req.body);
    } catch (error) {
        return await errorHandler.handle(error, res, 400);
    }

    try {
        const newProduct = await product.save();
        return res.status(201).json(newProduct);
    } catch (error) {
        try {
            if (req.file) 
                await deleteFile(path.join(global.publicDir, product.image));
        } catch (error) {
            return await errorHandler.handle(error, res, 500);
        }
        return await errorHandler.handle(error, res);
    }
})

//TODO Aggiungere un endpoint che dice se un prodotto e disponibile da a 

router.get('/:id', getProductById, async (req, res) => {
    res.json(res.product);
})

//TODO aggiungere una query per non fare cancellare anche le unità associate
router.delete('/:id', authentication.verifyAuth(requiredAuthLevel, false), getProductById, async (req, res) => {
    try {
        let removedProduct = res.product;

        let units = await removedProduct.getUnits();
        for (const unit of units) {
            await unit.remove();
        }

        await res.product.remove();

        if(removedProduct.image && removedProduct.image != global.productImagePlaceholderName)
            await deleteFile(path.join(global.publicDir, removedProduct.image));

        res.status(200).json(removedProduct);
    } catch (error) {
        return await errorHandler.handle(error, res, 500);
    }
})

router.patch('/:id', authentication.verifyAuth(requiredAuthLevel, false), getProductById, upload.single('image'), async (req, res) => {
    try {
        if (req.file){
            console.log("FILE: ", req.file);
            req.body.image = path.join(imageRelativePath, req.file.filename).substring(1); 
            await deleteFile(path.join(global.publicDir, res.product.image));
            console.log('New image patched, ' + req.body.image );
        }

        res.product.set(req.body);
        await res.product.save();

        res.status(200).json(res.product);
    } catch (error) {
        //TODO controllare il tipo di errore
        return await errorHandler.handle(error, res, 400);
    }
})

router.get('/:id/units', authentication.verifyAuth(requiredAuthLevel, false), getProductById, async (req, res) => {
    try {
        let units = await res.product.getUnits();
        res.status(200).json(units)
    } catch (error) {
        return await errorHandler.handle(error, res, 400);
    }
})

router.post('/:id/units', authentication.verifyAuth(requiredAuthLevel, false), getProductById, async (req, res) => {
    let unit = null;
    try {
        unit = await Unit(req.body);
        unit.set({ product: req.params.id });     //L'id del prodotto associato a quella unita è quello del prodotto in cui fa la post
    } catch (error) {
        return await errorHandler.handle(error, res, 400);
    }

    try {
        const newUnit = await unit.save();
        res.status(201).json(newUnit);
    } catch (error) {
        return await errorHandler.handle(error, res);
    }
})

router.get('/:id/available', getProductById, async (req, res) => {
    let response = {};
    let availableUnits = [];
    let from = null;
    let to = null;
    try{
        if(req.query.to){
            to = new Date(req.query.to)
            from = new Date(req.query.from) || Date.now();
    
            availableUnits = await res.product.getAvailableUnitsFromTo(from,to)        
        } else {
            availableUnits = await res.product.getAvailableUnits();
            to = new Date();
            from = new Date();
        }

        availableUnits = availableUnits.filter(u => u.condition !== unitConditionLevel.broken)
    
        response = {
            available: availableUnits.length > 0,
            availableCount: availableUnits.length,
            availableUnits: availableUnits,
            to: to.toISOString(),
            from: from.toISOString() ,
        }
    
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({message: error.message});
    }

})

//TODO da aggiungere nella specifica di openapi
router.delete('/:id/units/:idunit', authentication.verifyAuth(requiredAuthLevel, false), getUnitById, async (req, res) => {
    try {
        let removedUnit = res.unit;
        await res.unit.remove();

        res.status(200).json(removedUnit);
    } catch (error) {
        return await errorHandler.handle(error, res, 500);
    }
})

//TODO aggiungere una query per restiture un determinato tags
router.get('/:id/tags', authentication.verifyAuth(requiredAuthLevel, false), getProductById, async (req, res) => {
    try {
        res.status(200).json(res.product.tags);
    } catch (error) {
        return await errorHandler.handle(error, res, 400);
    }
})

router.post('/:id/tags', authentication.verifyAuth(requiredAuthLevel, false), getProductById, async (req, res) => {
    try {
        if (res.product.tags.includes(req.body)) {
            const errmsg = "The tags posted is already on the tags list (" + req.body  + ")";
            return await errorHandler.handleMsg(errmsg, res, 409);
        }

        res.product.tags.push(req.body);

        await res.product.save();           //TODO forse non funziona
        res.status(201).json(req.body);
    } catch (error) {
        return await errorHandler.handle(error, res, 400);
    }
})

//TODO aggiungere una query per restiture un determinato tags
router.delete('/:id/tags', authentication.verifyAuth(requiredAuthLevel, false), getProductById, async (req, res) => {
    try {
        const tags = res.product.tags.filter(tag => { return tag.key == req.query.key && tag.value == req.query.value });

        for (const tag of tags) {
            const index = res.product.tags.indexOf(tag);
            if (index > -1) {
                res.product.tags.splice(index, 1);
            }
        }

        await res.product.save();
        return res.status(200).json(tags);
    } catch (error) {
        return await errorHandler.handle(error, res, 500);
    }
})

//TODO aggiungere una query per restiture un determinato tags
router.get('/:id/altproducts', authentication.verifyAuth(requiredAuthLevel, false), getProductById, async (req, res) => {
    try {
        let altproducts = (await res.product.populate("altproducts")).altproducts

        res.status(200).json(altproducts);
    } catch (error) {
        return await errorHandler.handle(error, res);
    }
})

router.post('/:id/altproducts', authentication.verifyAuth(requiredAuthLevel, false), getProductById, async (req, res) => {
    try {
        let idalt = req.body._id;
        if (res.product.altproducts.includes(idalt)) {
            const errmsg = "The product with id " + idalt + " is already in the altproducts list";
            return await errorHandler.handleMsg(errmsg, res, 409);
        }

        let altprod = await Product.findById(idalt);
        if (altprod == null) {
            const errmsg = "The alt product with id " + idalt + " does not exist in the db";
            return await errorHandler.handleMsg(errmsg, res, 404);
        }

        res.product.altproducts.push(idalt);
        await res.product.save();           //TODO forse non funziona
        res.status(201).json(altprod);
    } catch (error) {
        return await errorHandler.handle(error, res);
    }
})

router.delete('/:id/altproducts', authentication.verifyAuth(requiredAuthLevel, false), getProductById, async (req, res) => {
    try {
        let idalt = req.body._id;

        const index = res.product.altproducts.indexOf(idalt);
        if (index > -1) {
            res.product.altproducts.splice(index);
        }

        await res.product.save();
        let altprod = await Product.findById(idalt);
        return res.status(200).json(altprod);
    } catch (error) {
        return await errorHandler.handle(error, res, 500);
    }
})

router.get('/:id/priceEstimation', authentication.verifyAuth(authentication.authLevel.customer, false), authentication.getIdFromToken, getProductById, async (req, res) => {
    try {
        let from = req.query.from || Date.now();
        let to = req.query.to;
        if (!to) {
            const errmsg = "The query parameters 'to' is required";
            return await errorHandler.handleMsg(errmsg, res, 400);
        }

        from = new Date(from);
        to = new Date(to);
        
        let units = (await Unit.find({ product: req.params.id }))
        const unitsDisp = await res.product.getAvailableUnitsFromTo(from, to);
        const availableUnits = unitsDisp.filter(x => x.condition !== unitConditionLevel.broken);
        
        availableUnits.forEach(u => {u.price = res.product.price;})
        
        let agentId = req.agentId;
        


        const category = res.product.category;
        const subcategory = res.product.subcategory;
        const product = res.product;

        let priceEstimation = await computePriceEstimation(availableUnits, { from, to, agentId, category, subcategory, product });
        return res.status(200).json(priceEstimation);
    } catch (error) {
        return await errorHandler.handle(error, res);
    }
})


async function getProductById(req, res, next) {
    let product;
    try {
        product = await Product.findById(req.params.id);

        if (product == null) {
            const errmsg = "Product with id " + req.params.id + " not found on the database";
            return await errorHandler.handleMsg(errmsg, res, 404);
        }
    } catch (error) {
        return await errorHandler.handle(error, res);
    }

    res.product = product;
    next();
}

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
