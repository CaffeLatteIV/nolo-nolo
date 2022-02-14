const express = require('express');
const router = express.Router();
const authentication = require("../lib/authentication");
const fs = require('fs').promises;

let mongoose = undefined;


const max = 10**5;
const min = 10**4;
let otp = Math.floor(Math.random() * (max - min) + min);

router.get('/dropDatabase', authentication.verifyOnlyMasterKey, async (req, res) => {
    try {
        const oldOtp = otp
        otp = Math.floor(Math.random() * (max - min) + min);

        if(!req.query.otp) return res.status("202").json({otp: otp});
        
        
        if(parseInt(req.query.otp) !== oldOtp) {
            return res.status("403").json({otp: otp})
        } else {
            await dropDatabase();
            return res.status("200").json({message: "Database dropped"})
        }
    } catch (err) {
        return res.status("500").json({message: err.message});
    }
})

router.get('/dropCollection', authentication.verifyOnlyMasterKey, async (req, res) => {
    try {
        const oldOtp = otp
        otp = Math.floor(Math.random() * (max - min) + min);

        if(!req.query.otp || !req.query.collection) return res.status("202").json({otp: otp});
        
        
        if(parseInt(req.query.otp) !== oldOtp) {
            return res.status("403").json({otp: otp})
        } else {
            await dropCollection(req.query.collection);
            return res.status("200").json({message: "Collection dropped"})
        }
    } catch (err) {
        return res.status("500").json({message: err.message});
    }
})

router.get('/errorlog', async (req, res) => {
    try {
      const data = await fs.readFile("log/.errorlog.txt", {encoding: "utf8"})
      res.set({"Content-Disposition":"attachment; filename=.errorlog.txt"});
      return res.status("200").json(data)
    } catch (err) {
        return res.status("500").json({message: err.message});
    }
})

router.get('/log', async (req, res) => {
    try {
      const data = await fs.readFile("log/.log.txt", {encoding: "utf8"})
      res.set({"Content-Disposition":"attachment; filename=.log.txt"});
      return res.status("200").json(data)
    } catch (err) {
        return res.status("500").json({message: err.message});
    }
})

async function dropDatabase () {
    mongoose.connection.db.dropDatabase();
}

async function dropCollection (collection) {
    mongoose.connection.db.dropCollection(collection)
}

module.exports = function (db) {
    mongoose = db;
    return router
}