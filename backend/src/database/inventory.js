import mongoose from 'mongoose'
import { inventorySchema } from './schema.js'

class Inventory {
  constructor() {
    this.URL = process.env.URL || 'mongodb://localhost:27017/nolo-nolo'
    this.connect()
  }

  async connect() {
    this.mongoose = await mongoose.connect(this.URL)
    this.Inventory = mongoose.model('inventories', inventorySchema)
  }

  addInventory({ available, price, condition, category, title, description }) {
    return new this.Inventory({
      available,
      price,
      condition,
      category,
      title,
      description,
    }).save()
  }

  async findOneAvailable(title, category = undefined, id = undefined) {
    if (id) return this.Inventory.findById(id).exec()
    if (category) return this.Inventory.findOne({ category, available: true }).exec()
    return this.Inventory.findOne({ title, available: true }).exec()
  }

  async findAllCategory(category, available = undefined) {
    if (available !== undefined) return this.Inventory.find({ category, available }).exec()
    return this.Inventory.find({ category }).exec()
  }

  async findAllTitle(title, available = undefined) {
    if (available !== undefined) return this.Inventory.find({ title, available }).exec()
    return this.Inventory.find({ title }).exec()
  }
}
export default Inventory
