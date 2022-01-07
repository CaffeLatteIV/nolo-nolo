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
  media: {
    img: {
      type: String,
      default: 'http://localhost:5001/v1/inventories/image/not-available.png', // TODO cambiare
    },
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
  status: {
    type: String,
    enum: ['In uso', 'Prenotato'],
  },
})
const clientSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
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
  notifications: {
    type: [Schema.Types.ObjectId],
    default: [],
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
})
const refreshTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
})
export {
  inventorySchema,
  rentSchema,
  clientSchema,
  employeeSchema,
  refreshTokenSchema,
}
