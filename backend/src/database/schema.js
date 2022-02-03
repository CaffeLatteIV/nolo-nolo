/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose'

const { Schema } = mongoose

const inventorySchema = new Schema({
  available: {
    type: Boolean,
    required: true,
  },
  price: {
    weekend: {
      type: Number,
      required: true,
    },
    weekday: {
      type: Number,
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },

  },
  condition: {
    type: String,
    enum: ['Ottima', 'Buona', 'Parzialmente danneggiato'],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  media: {
    img: {
      type: String,
      default: 'http://localhost:5000/v1/image/not-available.png', // TODO cambiare
    },
  },
  stock: {
    type: Number,
    default: 1,
  },
  fidelityPoints: {
    type: Number,
    default: 3,
  },

}, {
  toObject: {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) { delete ret._id },
  },
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) { delete ret._id },
  },
})
const rentSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  start: {
    type: Number,
    required: true,
  },
  end: {
    type: Number,
    required: true,
  },
  productCode: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'inventories',
  },
  clientCode: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'employees',
  },
  price: {
    type: Number,
    required: true,
  },
  fidelityPoints: {
    type: Number,
    required: true,
  },
  earnedFidelityPoints: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Noleggiato', 'Prenotato', 'Pagato'],
  },
}, {
  toObject: {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) { delete ret._id },
  },
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) { delete ret._id },
  },
})
const clientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  birthDate: {
    type: Number,
    required: true,
  },
  preferredCategories: {
    type: [String],
    default: [],
  },
  payment: String,
  fidelityPoints: {
    type: Number,
    default: 0,
  },
  favourites: {
    type: [Schema.Types.ObjectId],
    default: [],
  },
  gender: {
    type: String,
    enum: ['Maschio', 'Femmina', 'Non specificato'],
    default: 'Non specificato',
  },
  phoneNumber: {
    type: String,
    required: true,
  },
}, {
  toObject: {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) { delete ret._id },
  },
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) { delete ret._id },
  },
})
const employeeSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['funzionario', 'manager'],
    required: true,
  },
}, {
  toObject: {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) { delete ret._id },
  },
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) { delete ret._id },
  },
})
const refreshTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
}, {
  toObject: {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) { delete ret._id },
  },
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) { delete ret._id },
  },
})
const offerSchema = new Schema({
  start: {
    type: Number,
    required: true,
  },
  end: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
}, {
  toObject: {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) { delete ret._id },
  },
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) { delete ret._id },
  },
})

export {
  inventorySchema,
  rentSchema,
  clientSchema,
  employeeSchema,
  refreshTokenSchema,
  offerSchema,
}
