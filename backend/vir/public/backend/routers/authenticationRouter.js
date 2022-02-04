const express = require('express');
const router = express.Router();
const Customer = require('../models/customer').model;
const Employee = require('../models/employee');
const authentication = require("../lib/authentication");

router.post('/customers/login', async (req, res) => {
    try {

        const email = req.body.email;
        const customer = (await Customer.find({'loginInfo.email': email}))[0];

        if (!customer) {
            return res.status(401).json({ message: "No customer found with that username/email" });
        }

        const correctPassword = await authentication.verifyCredential(req.body, customer.loginInfo)
        if (!correctPassword)
            return res.status(403).json({ message: "Password incorrect" });

        const jwtToken = await customer.generateToken();
        
        return res.status(200).set({ "Authorization": jwtToken }).json(customer);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

router.post('/employees/login', async (req, res) => {
    try {
        const email = req.body.email;
        const employee = (await Employee.find({'loginInfo.email': email}))[0];

        if (!employee) {
            return res.status(401).json({ message: "No employee found with that username/email" });
        }

        const correctPassword = await authentication.verifyCredential(req.body, employee.loginInfo)
        if (!correctPassword)
            return res.status(403).json({ message: "Password incorrect" });

        const jwtToken = await employee.generateToken();
        
        return res.status(200).set({ "Authorization": jwtToken }).json(employee);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

router.get('/verify', async (req, res) => {
    try {
        const token = req.headers["authorization"];
        
        if(!token) {
            return res.status(401).json({message: "Required authentication token"});
        }

        const decrypted = await authentication.verifyToken(token);
        let user = {};

        if(decrypted.auth === authentication.authLevel.admin || decrypted.auth === authentication.authLevel.employee) {
            user = await Employee.findById(decrypted.id);
        } else {
            user = await Customer.findById(decrypted.id);
        }

        return res.status(200).json(user);
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

router.get('/verifyCustomer', async (req, res) => {
    try {
        const token = req.headers["authorization"];
        
        if(!token) {
            return res.status(401).json({message: "Required authentication token"});
        }

        const decrypted = await authentication.verifyToken(token);
        let user = {};

        if(decrypted.auth === authentication.authLevel.admin || decrypted.auth === authentication.authLevel.employee) {
            throw new Error("The token is not of a customer, but is of a " +  decrypted.auth);
        } else {
            user = await Customer.findById(decrypted.id);
        }

        return res.status(200).json(user);
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

router.get('/verifyEmployee', async (req, res) => {
    try {
        const token = req.headers["authorization"];
        
        if(!token) {
            return res.status(401).json({message: "Required authentication token"});
        }

        const decrypted = await authentication.verifyToken(token);
        let user = {};

        if(decrypted.auth === authentication.authLevel.admin || decrypted.auth === authentication.authLevel.employee) {
            user = await Employee.findById(decrypted.id);
        } else {
            throw new Error("The token is not of an employee or an admin, but is of a customer.");
        }

        return res.status(200).json(user);
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})


module.exports.router = router;

