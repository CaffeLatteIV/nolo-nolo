import mongoose from 'mongoose'
import { inventorySchema } from './schema.js'

class Inventory {
  constructor() {
    this.connect()
    this.URL = (process.env.URL || 'mongodb://localhost:27017/nolo-nolo')
  }

  async connect() {
    this.mongoose = await mongoose.connect(this.URL)
    this.Inventory = mongoose.model('inventories', inventorySchema)
  }

  async addInventory({ available, price, condition, category, title, description }) {
    await new this.Inventory({
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
    if (category) return this.Inventory.findOne({ title, category, available: true }).exec()
    return this.Inventory.findOne({ title, available: true }).exec()
  }

  async findAll(category, available = undefined) {
    if (available !== undefined) return this.Inventory.find({ category, available }).exec()
    return this.Inventory.find({ category }).exec()
  }
}
export default Inventory
