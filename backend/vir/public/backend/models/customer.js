const mongoose = require('mongoose');
const auth = require('../lib/authentication');
const { validateEmail, validateNotEmail } = require('../lib/validation');
 
//const loginInfoSchema = require('../models/loginInfo');
//var uniqueValidator = require('mongoose-unique-validator');


const addressSchema = new mongoose.Schema({
    country: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    zipcode: {
        type: String,
        required: true,
    },
    streetAddress: {
        type: String,
        required: true,
    }
}, { _id : false });

const customerSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: false,
    },
    lastname:{
        type: String,
        required: false,
    },
    dateOfBirth:{
        type: Date,
        default: Date.now(),
    },
    loginInfo: {
        username: {
            type: String,
            required: true,
            unique: true,
            validate: validateNotEmail,
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: validateEmail,
        },
    },
    address: addressSchema,
    profilePicture: {
        type: String,
        default: 'image/profile/placeholder.png'
    },
    description: {
        type: String,
        default: ''
    }
})

customerSchema.methods.generateToken = async function() {
    return await auth.generateToken(auth.authLevel.customer, this.username, this._id);
}

module.exports.model = mongoose.model('Customer', customerSchema);
module.exports.schema = customerSchema;
