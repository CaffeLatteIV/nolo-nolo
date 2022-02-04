const mongoose = require('mongoose');
//const {billmodel, priceEstimationSchema, billSchema} = require("bill");

const rentalState = {
    pending: 'pending',
    open: 'open',
    close: 'close',
}

const rentalSchema = new mongoose.Schema({
    customer:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Customer",
    },
    employee: {
        //The employee is null until state is pending
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
    },
    prenotationDate:{
        type: Date,
        required: true
    },
    state: {
        type: String,
        enum: [rentalState.pending, rentalState.open, rentalState.close],
        required: true, 
        default: 'pending'
    },
    //Until the state is open, bill is null
    bill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bill",
    },
    startDate: {
        type: Date,
        required: true
    },
    expectedEndDate: {
        type: Date,
        required: true
    },
    //The actual end of the rent is null until state is open
    actualEndDate: {
        type: Date
    },
    unit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Unit",
        required: true
    },
    priceEstimation: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    replacementUnit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Unit",
        required: false,
    }
})

rentalSchema.methods.isPending = function() {
    return this.state === rentalState.pending;
}

rentalSchema.methods.isOpen = function() {
    return this.state === rentalState.open;
}

rentalSchema.methods.isClosed = function() {
    return this.state === rentalState.close;
}

rentalSchema.methods.populateAll = async function () {
    await this.populate(['customer','employee','bill','unit','priceEstimation'])
    if(this.unit) {
        await this.populate('unit.product')
    }
    return this
}

module.exports = mongoose.model('Rental', rentalSchema);
module.exports.rentalState = rentalState;

