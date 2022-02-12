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

  async addInventory({ available, price, condition, category, title, description, media, stock, fidelityPoints }) {
    return new this.Inventory({
      available,
      price,
      condition,
      category,
      title,
      description,
      media,
      stock,
      fidelityPoints,
    }).save()
  }

  async findOne(id = undefined) {
    return this.Inventory.findById(id).exec()
  }

  async listAllCategoryNames(unique = undefined) {
    const categoryList = await this.Inventory.find({}, 'category id').exec()
    if (unique === undefined) return categoryList
    const list = []
    categoryList.forEach((item) => {
      list.push(item.category)
    })
    return list.filter((value, index, self) => self.indexOf(value) === index)
  }

  async findAllCategory(category, available = undefined) {
    if (available !== undefined) return this.Inventory.find({ category, available }).exec()
    return this.Inventory.find({ category }).exec()
  }

  async findAll() {
    return this.Inventory.find({ available: true }).exec()
  }

  async findAllTitle(title, available = undefined) {
    if (available !== undefined) return this.Inventory.find({ title, available }).exec()
    return this.Inventory.find({ title }).exec()
  }

  async update(product) {
    return this.Inventory.findByIdAndUpdate(product.id, product).exec()
  }

  async delete(id) {
    return this.Inventory.findByIdAndDelete(id).exec()
  }
}
export default Inventory
