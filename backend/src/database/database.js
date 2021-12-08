import mongoose from 'mongoose'
import { inventorySchema, rentSchema, clientSchema } from './schema.js'

class Database {
  constructor(url = undefined) {
    this.URL = (url || 'mongodb://localhost:27017/nolo-nolo')
  }

  async connect() {
    this.mongoose = await mongoose.connect(this.URL)
    this.Inventory = mongoose.model('inventories', inventorySchema)
    this.Rentals = mongoose.model('rentals', rentSchema)
    this.Clients = mongoose.model('clients', clientSchema)
  }

  addClients({ username, password, preferredCategories, payment, fidelityPoints, description, favourites, notifications }) {
    new this.Clients({
      username,
      password,
      preferredCategories,
      payment,
      fidelityPoints,
      description,
      favourites,
      notifications,
    }).save()
  }

  addRentals({ start, end, productCode, userCode, price, fidelityPoints }) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    new this.Rentals({
      start,
      end,
      productCode,
      userCode,
      price,
      fidelityPoints,
    }).save()
  }

  addInventory({ available, price, condition, category, title, description }) {
    new this.Inventory({
      available,
      price,
      condition,
      category,
      title,
      description,
    }).save()
  }

  async findClient(username, id = undefined) {
    if (id) return this.Clients.findById(id)
    return this.Clients.findOne({ username }).exec()
  }

  async findInventory(title, id = undefined) {
    if (id) return this.Inventory.findById(id)
    return this.Inventory.findOne({ title, available: true }).exec()
  }

  async findRentals(userID) {
    return this.Clients.find({ clientCode: userID }).exec()
  }
}
export default Database
