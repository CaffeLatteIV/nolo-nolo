import mongoose from 'mongoose'

const { Schema } = mongoose

const inventorySchema = new Schema({
  available: Boolean,
  price: Number,
  condition: String,
  category: String,
  title: String,
  description: String,
})
const rentSchema = new Schema({
  start: Number,
  end: Number,
  productCode: Schema.Types.ObjectId,
  clientCode: Schema.Types.ObjectId,
  price: Number,
  fidelityPoints: Number,
})
const clientSchema = new Schema({
  username: String,
  password: String,
  preferredCategories: [String],
  payment: String,
  fidelityPoints: Number,
  favourites: [Schema.Types.ObjectId],
  notifications: [Schema.Types.ObjectId],
})

export {
  inventorySchema,
  rentSchema,
  clientSchema,
}
