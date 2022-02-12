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
    for (let i = start; i < end; i += 86400000) { // 86400000 = ms in a day
      let priceDay = 0
      const day = new Date(i)
      const isWeekend = day.getDay() === 0 || day.getDay() === 6
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
            priceDay = (priceDay * 100) / (100 - offer.discount)
          }
        })
      }

      priceTmp += priceDay
    }
    if (coupon) {
      priceTmp = (priceTmp * 100) / (100 - coupon)
    }
    const daysBetweenDates = Math.max(Math.ceil((end - start) / (1000 * 60 * 60 * 24)), 1) // almeno un giorno
    const earnedFidelityPoints = daysBetweenDates * (product.fidelityPoints)

    return {
      title: product.title,
      start,
      status: 'Noleggiato',
      end,
      clientCode,
      productCode,
      price: priceTmp,
      earnedFidelityPoints,
      fidelityPoints: spentFidelityPoints,
      discount: coupon,
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
}

export default Rental
