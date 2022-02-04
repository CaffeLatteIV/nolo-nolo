const mongoose = require('mongoose');
const auth = require('../lib/authentication');
const { validateEmail, validateNotEmail } = require('../lib/validation');
const Rental = require('./rental');

const employeeSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: false,
    },
    lastname:{
        type: String,
        required: false,
    },
    loginInfo:{
        username:{
            type: String,
            required: true,
            unique: true,
            validate: validateNotEmail,
        },
        password:{
            type: String,
            required: true,
        },
        email:{
            type: String,
            required: true,
            unique: true,
            validate: validateEmail,
        }
    },
    authorization:{
        type: String,   
        required: false,
        enum: [auth.authLevel.admin, auth.authLevel.employee],
        default: auth.authLevel.employee
    },
    profilePicture: {
        type: String,
        default: 'image/profile/placeholder.png'
    }
})

employeeSchema.methods.generateToken = async function() {
    return await auth.generateToken(this.authorization, this.username, this._id);
}

employeeSchema.methods.getRentals = async function() {
    return await Rental.find({employee: this._id});
}

employeeSchema.methods.getOpenRentals = async function() {
    return (await this.getRentals()).filter(r => r.isOpen());
}

employeeSchema.methods.hasOpenRentals = async function() {
    return (await this.getOpenRentals()).length > 0;
}

module.exports = mongoose.model('Employee', employeeSchema);