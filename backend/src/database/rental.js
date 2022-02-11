/* eslint-disable no-param-reassign */
import mongoose from 'mongoose'
import { rentSchema, inventorySchema, maintenanceSchema } from './schema.js'

class Rental {
  constructor() {
    this.Inventory = mongoose.model('inventories', inventorySchema)
    this.Rentals = mongoose.model('rentals', rentSchema)
    this.Maintenance = mongoose.model('maintenance', maintenanceSchema)
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
    // neccessario perchè mongoose (o mongodb) non danno la possibilità di modificare i dati dell'array
    // quindi bisogna fare un workaround aggiungenod una variabile copia di ogni elemento
    rentals.forEach((element, index, arr) => {
      const tmp = {}
      tmp.title = element.title
      tmp.start = element.start
      tmp.end = element.end
      tmp.media = element.productCode.media
      tmp.productCode = element.productCode.id
      tmp.clientCode = element.clientCode
      tmp.price = element.price
      tmp.fidelityPoints = element.fidelityPoints
      tmp.earnedFidelityPoints = element.fidelityPoints
      tmp.status = element.status
      tmp.id = element.id
      arr[index] = tmp
    })
    return rentals
  }

  async getUserActiveRentals(start, clientCode) {
    return this.Rentals.find({ start: { $lte: start }, end: { $gte: start }, clientCode }).exec()
  }

  async findProductRentals(productCode) {
    return this.Rentals.find({ productCode }).exec()
  }

  async find(clientCode, productCode) {
    return this.Rentals.find({ productCode, clientCode }).exec()
  }

  async checkAvailability(start, end, productCode) {
    const overlappingProduct = await this.Rentals.find({ start: { $gte: start, $lte: end }, productCode }) || [] // inizia nel periodo
    overlappingProduct.push(...await this.Rentals.find({ end: { $gte: start, $lte: end }, productCode })) // finisce nel periodo
    overlappingProduct.push(...await this.Rentals.find({ start: { $lte: start }, end: { $gte: end }, productCode })) // inizia prima e finisce dopo
    // maintenance
    const hasMaintenance = await this.Maintenance.find({ start: { $gte: start, $lte: end }, productCode }) || [] // inizia nel periodo
    hasMaintenance.push(...await this.Maintenance.find({ $or: [{ end: { $gte: start, $lte: end }, productCode }, { end: 0 }] })) // finisce nel periodo
    hasMaintenance.push(...await this.Maintenance.find({ $or: [{ start: { $lte: start }, end: { $gte: end }, productCode }, { start: { $lte: start }, end: 0 }] })) // inizia prima e finisce dopo
    if (hasMaintenance.length > 0) return false // se il prodotto in quella data è in manutenzione
    const product = await this.Inventory.findById(productCode).exec()
    return (new Set(overlappingProduct)).size < product.stock
  }

  async findEndings(date) {
    const rentals = this.Rentals.find({ end: { $lte: date } }).exec()
    if (Array.isArray(rentals)) return rentals.sort(((a, b) => b - a)) // dsc
    return rentals
  }

  async findStarts(date) {
    const rentals = this.Rentals.find({ start: { $gte: date } }).exec()
    if (Array.isArray(rentals)) return rentals.sort(((a, b) => a - b)) // asc
    return rentals
  }

  async getAllRentals() {
    return this.Rentals.find().exec()
  }

  async deleteRental(id) {
    return this.Rentals.findByIdAndDelete(id).exec()
  }

  async payRent(rentId) {
    const rent = await this.Rentals.findById(rentId).exec()
    const today = new Date().getTime()
    const avgPrice = Math.ceil(rent.end - rent.start / 86400000) / rent.price
    const fee = Math.max(Math.floor((today - rent.end) / 86400000), 0) * avgPrice
    return { fee, avgPrice, rent }
  }
}

export default Rental
