import mongoose from 'mongoose'
import { rentSchema, inventorySchema } from './schema.js'

class Rental {
  constructor() {
    this.URL = process.env.URL || 'mongodb://localhost:27017/nolo-nolo'
    this.connect()
  }

  async connect() {
    this.mongoose = await mongoose.connect(this.URL)
    this.Inventory = mongoose.model('inventories', inventorySchema)
    this.Rentals = mongoose.model('rentals', rentSchema)
  }

  async addRentals({ earnedFidelityPoints, status, title, start, end, productCode, clientCode, price, fidelityPoints }) {
    await new this.Rentals({
      title,
      start,
      status,
      end,
      clientCode,
      productCode,
      price,
      earnedFidelityPoints,
      fidelityPoints,
    }).save()
  }

  async findUserRentals(clientCode) {
    const rentals = await this.Rentals.find({ clientCode }).populate('productCode', 'media').exec()
    const res = []
    rentals.forEach((element) => {
      element.media = element.productCode.media
      element.productCode = element.productCode.id
      res.push(element)
    })
    return res
  }

  async findProductRentals(productCode) {
    return this.Rentals.find({ productCode }).exec()
  }

  async find(clientCode, productCode) {
    return this.Rentals.find({ productCode, clientCode }).exec()
  }

  async checkAvailability(start, end, productCode) {
    const overlappingProduct = await this.Rentals.find({ start: { $gte: start, $lte: end }, productCode }) || []
    overlappingProduct.push(...await this.Rentals.find({ end: { $gte: start, $lte: end }, productCode }))
    const product = await this.Inventory.findById(productCode).exec()
    return (new Set(overlappingProduct)).size < product.stock
  }

  async findEndings(date) {
    const rentals = this.Rentals.find({ end: { $lte: date } })
    if (Array.isArray(rentals)) return rentals.sort(((a, b) => b - a)) // dsc
    return rentals
  }

  async findStarts(date) {
    const rentals = this.Rentals.find({ start: { $gte: date } })
    if (Array.isArray(rentals)) return rentals.sort(((a, b) => a - b)) // asc
    return rentals
  }
}
export default Rental
