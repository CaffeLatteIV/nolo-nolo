import mongoose from 'mongoose'
import { inventorySchema, rentSchema } from './schema.js'

class Inventory {
  constructor() {
    this.Inventory = mongoose.model('inventories', inventorySchema)
    this.Rentals = mongoose.model('rentals', rentSchema)
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

  async findOne(id) {
    return this.Inventory.findById(id).exec()
  }

  async listAllCategoryNames(unique = undefined) {
    const categoryList = await this.Inventory.find({ available: true }, 'category id').exec()
    if (unique === undefined) return categoryList
    const list = []
    categoryList.forEach((item) => {
      list.push(item.category)
    })
    return [...new Set(list)]
  }

  async findAllCategory(category) {
    return this.Inventory.find({ category, available: true }).exec()
  }

  async findAllUnique() {
    const products = await this.Inventory.find({ available: true }).exec()
    const conditions = ['Ottima', 'Buona', 'Parzialmente danneggiato']
    const res = []
    products.forEach((product) => {
      let add = true
      res.forEach((elem, index) => {
        const eCondition = conditions.indexOf(elem.condition)
        const pCondition = conditions.indexOf(product.condition)
        if (elem.title === product.title && pCondition < eCondition) {
          res.splice(index, 1)
        } else if (elem.title === product.title && pCondition >= eCondition) {
          add = false
        }
      })
      if (add) res.push(product)
    })
    return res
  }

  async findAll() {
    return (await this.Inventory.find().exec()).sort((a, b) => a.title.localeCompare(b.title))
  }

  async findAllTitle(title, available = undefined) {
    if (available !== undefined) return this.Inventory.find({ title, available }).exec()
    return this.Inventory.find({ title }).exec()
  }

  async update(product) {
    return this.Inventory.findByIdAndUpdate(product.id, product).exec()
  }

  async delete(id) {
    const today = new Date().getTime()
    await this.Rentals.deleteMany({ productCode: id, start: { $gt: today } })
    return this.Inventory.findByIdAndDelete(id).exec()
  }

  async findSameTitle(title) {
    const products = await this.Inventory.find({ title }).exec()
    const ottimaCond = products.filter((elem) => elem.condition === 'Ottima')[0]
    const buonaCond = products.filter((elem) => elem.condition === 'Buona')[0]
    const pdCond = products.filter((elem) => elem.condition === 'Parzialmente danneggiato')[0]
    return [ottimaCond, buonaCond, pdCond].filter(Boolean)
  }

  async getStatus(productCode) {
    const today = new Date().getTime()
    const hasBookedOrders = (await this.Rentals.find({ productCode, start: { $gte: today } }).exec()).length > 0
    const hasActiveOrders = (await this.Rentals.find({ productCode, start: { $lte: today }, end: { $gte: today } }).exec()).length > 0
    return { hasActiveOrders, hasBookedOrders }
  }
}
export default Inventory
