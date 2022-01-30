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
      console.log(rentals)
      element.media = element.productCode.media
      element.productCode = element.productCode.id
      res.push(element)
    })
    console.log(res)
    return res
  }

  async findProductRentals(productCode) {
    return this.Rentals.find({ productCode }).exec()
  }

  async find(clientCode, productCode) {
    return this.Rentals.find({ productCode, clientCode }).exec()
  }

  async findOverlappingDates(start, end, productCode) {
    const overlappingProduct = await this.Rentals.findOne({ start: { $gte: start, $lte: end }, productCode })
    if (overlappingProduct) return { start: overlappingProduct.start, end }
    return undefined
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
