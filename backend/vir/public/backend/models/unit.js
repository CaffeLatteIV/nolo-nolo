const mongoose = require('mongoose');
const Rental = require('./rental');
const rentalState = require('./rental').rentalState;

const conditionLevel = {
    perfect: "perfect",
    minorflaw: "minor flaw",
    majorflaw: "major flaw",
    broken: "broken",
}

const unitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    condition: {
        type: String,
        enum: [conditionLevel.perfect, conditionLevel.minorflaw, conditionLevel.majorflaw, conditionLevel.broken],
        required: true,
    },

    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product",
    },
    rentals: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        default: [],
        ref: "Rental",
    },
})

unitSchema.methods.getRentals = async function () {
    return await Rental.find({ unit: this._id });
}

unitSchema.methods.getOpenRentals = async function () {
    return (await this.getRentals()).filter(x => (x.state === rentalState.pending || x.state === rentalState.open));
}

unitSchema.methods.available = async function () {
    const dateNow = Date.now();
    const openRentals = await this.getOpenRentals();
    let rentalsInPeriod = openRentals.filter(
        x => { return (x.startDate <= dateNow && x.expectedEndDate >= dateNow) }
    )

    if(rentalsInPeriod.length > 1)
        throw new Error("There are more than one rentals associated with the units in this time frame. This is a server error");

    return rentalsInPeriod.length == 0;
};

unitSchema.methods.availableFromTo = async function (from, to) {
    if(from > to)
        throw new Error("Tryied to verify availability from " + from + " to " + to + "but from is after to");

    const openRentals = await this.getOpenRentals()
    let rentalsInPeriod = openRentals.filter(x => {
            console.log(from,to)
            return (x.startDate <= from && x.expectedEndDate >= from)
                || (x.startDate <= to && x.expectedEndDate >= to)
                || (x.startDate >= from && x.expectedEndDate <= to)
        })
    
    if(rentalsInPeriod.length > 1)
        throw new Error("There are more than one rentals associated with the units in this time frame. This is a server error");

    return rentalsInPeriod.length == 0;
}

unitSchema.methods.populateAll = async function () {
    await this.populate(['product','rentals'])
    return this
}

module.exports.model = mongoose.model('Unit', unitSchema);
module.exports.schema = unitSchema;
module.exports.conditionLevel = conditionLevel;
