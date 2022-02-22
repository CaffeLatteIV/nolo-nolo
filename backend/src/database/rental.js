/* eslint-disable no-param-reassign */
import mongoose from 'mongoose'
// import loggerWrapper from '../logger.js'
import { rentSchema, couponSchema, inventorySchema, offerSchema, maintenanceSchema, clientSchema } from './schema.js'

// const logger = loggerWrapper('RENTAL')
class Rental {
  constructor() {
    this.Inventory = mongoose.model('inventories', inventorySchema)
    this.Clients = mongoose.model('clients', clientSchema)
    this.Rentals = mongoose.model('rentals', rentSchema)
    this.Maintenance = mongoose.model('maintenance', maintenanceSchema)
    this.Offer = mongoose.model('offers', offerSchema)
    this.Coupon = mongoose.model('coupons', couponSchema)
  }

  async calculateReceipt(productCode, clientCode, start, end, useFidelityPoints, coupon) {
    const product = await this.Inventory.findById(productCode).exec()
    const client = await this.Clients.findById(clientCode).exec()
    // logger.info(`starting points ${client.fidelityPoints}`)
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
      // logger.info(`client.fidelityPoints before spending: ${client.fidelityPoints}`)
      if ((client.fidelityPoints - product.price.points >= 0) && useFidelityPoints) {
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
      // logger.info(`spentFidelityPoints: ${spentFidelityPoints}`)
      // logger.info(`client.fidelityPoints after: ${client.fidelityPoints}`)
    }

    if (coupon?.discount) {
      priceTmp *= Math.max(((100 - coupon.discount) / 100), 0)
    }
    priceTmp = Math.round(priceTmp * 100) / 100
    const earnedFidelityPoints = daysBetweenDates * (product.fidelityPoints)
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

  async addRental({ title, start, status, end, clientCode, productCode, price, earnedFidelityPoints, fidelityPoints }, coupon) {
    const client = await this.Clients.findById(clientCode).exec()
    const fidelityPointsTmp = fidelityPoints || 0
    await this.Clients.findByIdAndUpdate(clientCode, { fidelityPoints: client.fidelityPoints - fidelityPointsTmp + earnedFidelityPoints })

    // update coupon usage
    if (coupon) {
      const { clients } = await this.Coupon.findById(coupon.id).exec()
      if (coupon.start !== 0 && coupon.end !== 0) { // coupon a tempo
        await this.Coupon.findByIdAndUpdate(coupon.id, { clients }).exec()
      } else if (coupon.usage > 0) { // coupon ad usi
        const usage = coupon.usage - 1
        await this.Coupon.findByIdAndUpdate(coupon.id, { clients, usage }).exec()
      }
    }
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
    const rental = await this.Rentals.findById(id).exec()
    const client = await this.Clients.findById(rental.clientCode).exec()
    client.fidelityPoints -= rental.earnedFidelityPoints
    this.Clients.findByIdAndUpdate(client.id, { fidelityPoints: client.fidelityPoints }).exec()
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

  async findRental(rentalID) {
    return this.Rentals.findById(rentalID).populate('productCode').exec()
  }

  async updateRental(rental) {
    await this.Rentals.findByIdAndUpdate(rental.id, rental)
    return this.Rentals.findById(rental.id).exec()
  }
}

export default Rental
