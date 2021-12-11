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
    enum: ['Ottima', 'Buona', 'parzialmente danneggiato'],
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
})
const rentSchema = new Schema({
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
  },
  clientCode: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  fidelityPoints: {
    type: Number,
    required: true,
  },
})
const clientSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  preferredCategories: [String],
  payment: String,
  fidelityPoints: {
    type: Number,
    default: 0,
  },
  favourites: [Schema.Types.ObjectId],
  notifications: [Schema.Types.ObjectId],
})
const employeeSchema = new Schema({
  username: {
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
})

export {
  inventorySchema,
  rentSchema,
  clientSchema,
  employeeSchema,
}
