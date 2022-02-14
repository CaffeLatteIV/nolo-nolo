const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');
const Employee = null; //require('..//models/employee');
const authentication = require("../lib/authentication");
const validation = require("../lib/validation");

router.post('/customers/login', async (req, res) => {
    try{
        let username = req.body.username;
        let customer = null;
    
        if(validation.validateEmail(username)){
            customer = await Customer.find({email: req.body.username})[0];
        } else{
            customer = await Customer.find({username: req.body.username})[0];
        }
    
        if(!customer){
            return res.status(401).json({message: "No customer found with that username/email"});
        }
        
        if(!authentication.verifyCredential(req.body, customer.loginInfo))
            return res.status(403).json({message: "Password incorrect"});

        jwtToken = await customer.generateToken();
        return res.status(200).set({"Authorization": jwtToken});
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
});

router.post('/employees/login', async (req, res) => {
    res.status(200);
});

export {router};