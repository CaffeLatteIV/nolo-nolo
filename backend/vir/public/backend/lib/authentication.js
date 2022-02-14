const fs = require("fs").promises;
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const errorHandler = require('./errorHandler');
const {createFileAndDir} = require('./helper');


const authFileName = ".auth"
const authFilePath = global.rootDir + "/" + authFileName;
const masterKeyFileName = ".masterkey";
const masterKeyFilePath = global.rootDir + "/" + masterKeyFileName;


let privateKey = null;
let masterKey = null;

initializeAuthentication();

async function getOrCreateKey(filePath){
    let key;
    try{
        await createFileAndDir(filePath);
        const data = await fs.readFile(filePath, "utf8");
        if (data == ""){
            key = crypto.randomBytes(256).toString('base64');
            try{
                await fs.writeFile(filePath, key)
            } catch (err) {
                console.log(err);
            }
        } else{
            key = data;
        }
    } catch (err){
        errorHandler.logError(err)
    }

    return key;
}

async function initializeAuthentication() {
    privateKey = await getOrCreateKey(authFilePath);
    masterKey = await getOrCreateKey(masterKeyFilePath);

    console.log("masterKey: ", masterKey);
}

//------------ Password hashing --------------------------------

async function hash(string) {
    return await bcrypt.hash(string, 5);
}

async function hashPassword(req, res, next) {
    try{
        if(req.body.loginInfo && req.body.loginInfo.password)
            req.body.loginInfo.password = await hash(req.body.loginInfo.password);

    } catch (error) {
        return res.status(400).json({message: error.message});
    }
    next();
}

async function verifyCredential(loginInfoPassed, loginInfoExpected) {
    return await bcrypt.compare(loginInfoPassed.password, loginInfoExpected.password);
}

//------------ Password hashing --------------------------------


//------------ Token handling --------------------------------

const authLevel = {
    admin: "admin",
    employee: "employee",
    customer: "customer",
    unregistered: "unregistered",
}

const authLevelDict = {
    "admin" : 4,
    "employee": 3,
    "customer": 2,
    "unregistered": 1,
}

async function generateToken(auth, username, id){
    const unsignedToken = {
        auth: auth,
        username: username,
        id: id,
    }

    const signedToken = await jwt.sign(unsignedToken, privateKey);

    return signedToken;
}

function processToken(token) {
    if(!token) return undefined;
    if(token.startsWith('Bearer')) return token.substring(7);
    return token;
}

async function verifyToken(token) {
    return jwt.verify(processToken(token), privateKey);
}

function verifyAuth(requiredAuthLevel, checkId = false){
    return async function (req, res, next) {
        let token = processToken(req.headers["authorization"]);

        if(!token) {
            return res.status(401).json({message: "Required authentication token"});
        }

        if(masterKey && token === masterKey) {
            return next();
        }

        try{
            const decodedToken = await verifyToken(token);

            const authLevel = authLevelDict[decodedToken.auth]
            const id = decodedToken.id;

            if(authLevel >= authLevelDict[requiredAuthLevel] || (checkId && id == req.params.id)){
                return next();
            } else{
                return res.status(401).json({message: "Authorization level not sufficient to do this operation"});
            }
        } catch(err){
            return res.status(401).json({message: "Invalid authentication token [" + err.message + "]"});
        }
    }
}

function verifyOnlyMasterKey(req, res, next) {
    const token = processToken(req.headers["authorization"]);

    if(!token) {
        return res.status(401).json({message: "Required authentication token"});
    }

    if(masterKey && token === masterKey) {
        return next();
    }

    return res.status(401).json({message: "For this operation is necessary the master key of the server because it may cause damage to it"});
}

async function getIdFromToken(req, res, next) {
    const token = processToken(req.headers["authorization"]);
    if(!token || token === masterKey) {
        return next();             //Nel caso in cui non ci sia un token da cui prendere l'id dello username vado oltre
    }

    try{
        const decodedToken = await jwt.verify(token, privateKey);
        req.agentId = decodedToken.id;
        return next();
    } catch (error) {
        return res.status(401).json({message: "Invalid authentication token [" + error.message + "]"});
    }
}

//------------ Token handling --------------------------------
module.exports.verifyCredential = verifyCredential;
module.exports.generateToken = generateToken;
module.exports.authLevel = authLevel;
module.exports.hashPassword = hashPassword;
module.exports.verifyAuth = verifyAuth;
module.exports.hash = hash;
module.exports.getIdFromToken = getIdFromToken
module.exports.verifyToken = verifyToken;
module.exports.verifyOnlyMasterKey = verifyOnlyMasterKey;
