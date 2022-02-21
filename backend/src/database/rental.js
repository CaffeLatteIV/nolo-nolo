/* eslint-disable no-param-reassign */
import mongoose from 'mongoose'
import { rentSchema, inventorySchema, offerSchema, maintenanceSchema, clientSchema } from './schema.js'

class Rental {
  constructor() {
    this.Inventory = mongoose.model('inventories', inventorySchema)
    this.Clients = mongoose.model('clients', clientSchema)
    this.Rentals = mongoose.model('rentals', rentSchema)
    this.Maintenance = mongoose.model('maintenance', maintenanceSchema)
    this.Offer = mongoose.model('offers', offerSchema)
  }

  async calculateReceipt(productCode, clientCode, start, end, useFidelityPoints, coupon) {
    const product = await this.Inventory.findById(productCode).exec()
    const client = await this.Clients.findById(clientCode).exec()
    if (!product || !client) return undefined
    const offers = new Set(await this.Offer.find({
      $or: [
        { start: { $gte: start, $lte: end } },
        { end: { $gte: start, $lte: end } }],
    }).exec())
    let priceTmp = 0
    let spentFidelityPoints = 0
    let daysBetweenDates = 0
    for (let i = start; i <= end; i += 86400000) { // 86400000 = ms in a day
      daysBetweenDates += 1
      let priceDay = 0
      const day = new Date(i)
      const isWeekend = day.getDay() === 5 || day.getDay() === 6
      if (client.fidelityPoints - product.price.points > 0 && useFidelityPoints) {
        client.fidelityPoints -= product.price.points
        spentFidelityPoints += product.price.points
      } else if (isWeekend) {
        priceDay = product.price.weekend
      } else {
        priceDay = product.price.weekday
      }
      if (offers) {
        offers.forEach((offer) => {
          if (i >= offer.start && i <= offer.end) {
            priceDay *= Math.max(((100 - offer.discount) / 100), 1)
          }
        })
      }

      priceTmp += priceDay
    }
    if (coupon) {
      priceTmp *= Math.max(((100 - coupon) / 100), 0)
    }
    if (start !== end) {
      daysBetweenDates += 1
    }
    priceTmp = Math.round(priceTmp)
    const earnedFidelityPoints = daysBetweenDates * (product.fidelityPoints)
    await this.Clients.findByIdAndUpdate(client.id, { fidelityPoints: client.fidelityPoints + earnedFidelityPoints })
    return {
      title: product.title,
      start,
      status: 'Noleggiato',
      end,
      clientCode,
      productCode,
      price: Math.max(priceTmp, product.price.weekday),
      earnedFidelityPoints,
      fidelityPoints: spentFidelityPoints,
      coupon,
    }
  }

  async addRental({ title, start, status, end, clientCode, productCode, price, earnedFidelityPoints, fidelityPoints }) {
    return new this.Rentals({
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
    overlappingProduct.push(...await this.Maintenance.find({ start: { $gte: start, $lte: end }, productCode })) // inizia nel periodo
    overlappingProduct.push(...await this.Maintenance.find({ $or: [{ end: { $gte: start, $lte: end }, productCode }, { end: 0, productCode }] })) // finisce nel periodo
    overlappingProduct.push(...await this.Maintenance.find({ $or: [{ start: { $lte: start }, end: { $gte: end }, productCode }, { start: { $lte: start }, end: 0, productCode }] })) // inizia prima e finisce dopo
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
    return this.Rentals.findByIdAndDelete(id)
  }

  async summarizePayment(rentId) {
    const rent = await this.Rentals.findById(rentId).populate('productCode').exec()
    const today = new Date().getTime()
    const avgPrice = Math.ceil(rent.price / (rent.end - rent.start / 86400000))
    const daysBetween = Math.max(Math.floor((today - rent.end) / 86400000), 0)
    const fee = daysBetween > 3 ? daysBetween * avgPrice : 0
    return { fee, avgPrice, rent, daysBetween }
  }

  async payRent(rentId) {
    return this.Rentals.findByIdAndUpdate(rentId, { status: 'Pagato' })
  }

  async findRental(rentalID) {
    return this.Rentals.findById(rentalID).populate('productCode').exec()
  }

  async updateRental(rental) {
    await this.Rentals.findByIdAndUpdate(rental.id, rental)
    return this.Rentals.findById(rental.id).exec()
  }
}

export default Rental
