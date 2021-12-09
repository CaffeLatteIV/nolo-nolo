import mongoose from 'mongoose'
import { rentSchema } from './schema.js'

class Rental {
  constructor() {
    this.URL = process.env.URL || 'mongodb://localhost:27017/nolo-nolo'
    this.connect()
  }

  async connect() {
    this.mongoose = await mongoose.connect(this.URL)
    this.Rentals = mongoose.model('rentals', rentSchema)
  }

  async addRentals({ start, end, productCode, clientCode, price, fidelityPoints }) {
    await new this.Rentals({
      start,
      end,
      clientCode,
      productCode,
      price,
      fidelityPoints,
    }).save()
  }

  async findUserRentals(clientCode) {
    return this.Rentals.find({ clientCode }).exec()
  }

  async findProductRentals(productCode) {
    return this.Rentals.find({ productCode }).exec()
  }

  async find(clientCode, productCode) {
    return this.Rentals.find({ productCode, clientCode }).exec()
  }

  async findRecentEndings(date) {
    const rentals = this.Rentals.find({ end: { $lte: date } })
    if (Array.isArray(rentals)) return rentals.sort(((a, b) => b - a))
    return rentals
  }
}
export default Rental
