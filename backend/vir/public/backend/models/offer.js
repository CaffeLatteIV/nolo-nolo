const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    modifier: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: true
    },
    categoryFilter: {
        type: Array,
        required: false,
    },
})

module.exports.model = mongoose.model('Offer', offerSchema);
module.exports.schema = offerSchema;