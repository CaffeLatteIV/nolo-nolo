const mongoose = require('mongoose');
const Unit = require('./unit').model;
const tagSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    }
}, { _id: false });

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
        default: "image/product/placeholder.jpg",
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: String,
        required: true,
    },
    subcategory: {
        type: String,
        required: true,
    },
    tags: [tagSchema],
    altproducts: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        ref: 'Product',
    }
})

productSchema.methods.getUnits = async function () {
    return await Unit.find({product: this._id});
}

productSchema.methods.getAvailableUnits = async function () {
    return await (await this.getUnits()).filterAsync(async (x) => await x.available());
}

productSchema.methods.getAvailableUnitsFromTo = async function (from, to ) {
    return await (await this.getUnits()).filterAsync(async (x) => await x.availableFromTo(from, to));
}

//TODO da aggiungere nella specifica di openapi
productSchema.methods.available = async function () {
    return (await this.getAvailableUnits()).length > 0;
};


productSchema.methods.availableFromTo = async function (from, to) {
    return (await this.getAvailableUnitsFromTo(from, to)).length > 0;
}

productSchema.methods.populateAll = async function () {
    await this.populate(['altproducts'])
    return this
}

module.exports.model = mongoose.model('Product', productSchema);
module.exports.schema = productSchema;
