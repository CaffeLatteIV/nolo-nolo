const express = require('express');
const Employee = require('../models/employee');
const Customer = require('../models/customer');
const Rental = require('../models/rental');
const router = express.Router();
const authentication = require('../lib/authentication');
const errorHandler = require('../lib/errorHandler');
const path = require('path');
const paginate = require('../lib/pagination').paginate;
const { deleteFile, getRandomNameForImage} = require('../lib/helper');


const requiredAuthLevel = authentication.authLevel.admin

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

router.get('/', authentication.verifyAuth(requiredAuthLevel, false), async (req, res) => {
    try {
        let query = {}
        if(req.query.username)
            query["loginInfo.username"] = req.query.username;
        if(req.query.email)
            query["loginInfo.email"] = req.query.email;
        if(req.query.firstname)
            query["firstname"] = req.query.firstname;
        if(req.query.lastname)
            query["lastname"] = req.query.lastname;

        //Prendere tutti gli impiegati con rent aperti 

        let employees = await Employee.find(query)   
        
        if(req.query.openRentals){
            if(JSON.parse(req.query.openRentals))
                employees = await employees.filterAsync(async e => await e.hasOpenRentals())
            else
                employees = await employees.filterAsync(async e => !(await e.hasOpenRentals()))
        }

        if (req.query.nameStartWith){
            const startWith = req.query.nameStartWith.toLowerCase();
            employees = employees.filter(e => {
                return `${e.firstname} ${e.lastname}`.toLowerCase().includes(startWith) ||  `${e.lastname} ${e.firstname}`.toLowerCase().includes(startWith)
            })
        }

        res.status(200).json(paginate(employees, req.query));
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.post('/', upload.single('profilePicture'), authentication.hashPassword, async (req, res) => {
    let employee = null;
    let jwtToken = null;
    try{
        if(req.file)
            req.body.profilePicture = path.join(imageFolderRelativePath, req.file.filename).substring(1);

        employee = await Employee(req.body);
        jwtToken = await employee.generateToken();
    } catch (error) {
        res.status(400).json({message: error.message})
    }

    try {
        const newEmployee = await employee.save();
        res.status(201).set({"Authorization": jwtToken}).json(newEmployee);
    } catch (error) {
        try{
            if(req.file)
                await deleteFile(path.join(global.publicDir, employee.profilePicture));
        } catch (error) {
            return await errorHandler.handle(error, res, 500);
        }

        res.status(409).json({message: error.message});
    }
})

router.get('/:id', authentication.verifyAuth(requiredAuthLevel, true), getEmployeeById, async (req, res) => {
    res.json(res.employee);
})

router.delete('/:id', authentication.verifyAuth(requiredAuthLevel, true), getEmployeeById, async (req, res) => {
    try{
        let removedEmployee = res.employee
        await res.employee.remove();

        if(removedEmployee.image && removedEmployee.image != global.profileImagePlaceholderName)
            await deleteFile(path.join(global.publicDir, removedEmployee.profilePicture));


        res.status(200).json(removedEmployee);
    } catch(error){
        res.status(500).json({message: error.message});
    }
})

router.patch('/:id', authentication.verifyAuth(requiredAuthLevel, true), authentication.hashPassword, getEmployeeById, async (req,res) => {
    try{
        res.employee.set(req.body);
        await res.employee.save();

        res.status(200).json(res.employee);
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

router.get('/:id/rentals',authentication.verifyAuth(requiredAuthLevel, true), getEmployeeById, async (req, res) => {
    try{
        let rentals = await Rental.find({ employee: req.params.id })

        if(req.query.populate && JSON.parse(req.query.populate)) {
            rentals = await rentals.mapAsync(async(r) => await r.populateAll())
        }

        res.status(200).json(paginate(rentals, req.query));
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

router.get('/:id/customers', authentication.verifyAuth(requiredAuthLevel, true), getEmployeeById, async (req,res) => {
    try {
        let rentals = await Rental.find({ employee: req.params.id })

        if(req.query.populate && JSON.parse(req.query.populate)) {
            rentals = await rentals.mapAsync(async(r) => await r.populateAll())
        }

        let customer = [...new Set(rentals.map(rent => JSON.stringify(rent.customer)))]
        customer = customer.map(customer => JSON.parse(customer))
        
        res.status(200).json({customer})
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

async function getEmployeeById(req, res, next) {
    let employee;
    try {
        employee = await Employee.findById(req.params.id);
        if(employee == null){
            return res.status(404).json({message: "Employee not found on the database"});
        }
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({message: error.message});
    }

    res.employee = employee;
    next();
}

module.exports = router;