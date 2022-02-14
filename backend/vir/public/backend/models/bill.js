const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Customer",
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Employee"
    },
    priceRecap: {
        type: mongoose.Schema.Types.Mixed, 
        required: true
    },
    startRent: {
        type: Date,
        required: true
    },
    endRent: {
        type: Date,
        required: true
    },
    employeeMessage: {
        type: String,
        required: false,
    } 
})

module.exports.model = mongoose.model('Bill', billSchema);
module.exports.schema = billSchema;