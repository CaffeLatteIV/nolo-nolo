/* eslint-disable no-await-in-loop */
/* eslint-disable dot-notation */
import mongoose from 'mongoose'
import { closest } from 'fastest-levenshtein'
import { clientSchema, inventorySchema, rentSchema } from './schema.js'
// import loggerWrapper from '../logger.js'

// const logger = loggerWrapper('Operations-DB')
class Operation {
  constructor() {
    this.Clients = mongoose.model('clients', clientSchema)
    this.Inventory = mongoose.model('inventories', inventorySchema)
    this.Rentals = mongoose.model('rentals', rentSchema)
  }

  async findbestSellers(n = 3) {
    const rentals = await this.Rentals.find().exec()
    const uniqueItems = {}
    rentals.forEach((item) => {
      const productCode = item.productCode.valueOf()
      if (uniqueItems[productCode] === undefined) {
        uniqueItems[productCode] = 1
      } else {
        uniqueItems[productCode] += 1
      }
    })
    const itemsArr = Object.keys(uniqueItems).sort((a, b) => uniqueItems[a] - uniqueItems[b]) // oridno i titoli per più venduti
    const res = []
    for (let i = 0; i < itemsArr.length && n > 0; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const product = await this.Inventory.findById(itemsArr[i]).exec()
      if (product) {
        res.push(product) // restituisco gli oggetti corrispondenti ai titoli
        // eslint-disable-next-line no-param-reassign
        n -= 1
      }
    }
    return res
  }

  // utilizza la distanza di levenshtein https://en.wikipedia.org/wiki/Levenshtein_distance
  async findSimilarTitle(title) {
    const productList = await this.Inventory.find().exec() // restituisce sia il titolo che l'id corrispondente all'oggetto
    const titleList = [...new Set(productList.map((product) => product.title))] // estraggo solo il titolo
    const wordList = []
    titleList.forEach((word) => {
      wordList.push(...word.split(' '))
    })
    const closestTitle = closest(title, wordList) // trovo il titolo più simile
    return productList.filter((product) => product.title.includes(closestTitle)) // ritorno tutti gli oggetti con lo stesso titolo + il loro ID
  }

  async groupClientAge() {
    const data = []
    const msYear = 31556952000 // ms in a year
    const today = new Date().getTime()
    data.push((await this.Clients.find({ birthDate: { $gte: (today - (17 * msYear)) } }).exec()).length)
    data.push((await this.Clients.find({ birthDate: { $lte: (today - (18 * msYear)), $gte: (today - (24 * msYear)) } }).exec()).length)
    data.push((await this.Clients.find({ birthDate: { $lte: (today - (24 * msYear)), $gte: (today - (34 * msYear)) } }).exec()).length)
    data.push((await this.Clients.find({ birthDate: { $lte: (today - (34 * msYear)), $gte: (today - (44 * msYear)) } }).exec()).length)
    data.push((await this.Clients.find({ birthDate: { $lte: (today - (44 * msYear)), $gte: (today - (54 * msYear)) } }).exec()).length)
    data.push((await this.Clients.find({ birthDate: { $lte: (today - (54 * msYear)), $gte: (today - (64 * msYear)) } }).exec()).length)
    data.push((await this.Clients.find({ birthDate: { $lte: (today - (65 * msYear)) } }).exec()).length)
    const labels = ['0-17', '18-24', '25-34', '35-44', '45-54', '55-64', '65+']
    return { data, labels }
  }

  async countGender() {
    const data = []
    data.push((await this.Clients.find({ gender: 'Maschio' }).exec()).length || 0)
    data.push((await this.Clients.find({ gender: 'Femmina' }).exec()).length || 0)
    data.push((await this.Clients.find({ gender: 'Non specificato' }).exec()).length || 0)
    const labels = ['Maschio', 'Femmina', 'Non specificato']
    return { data, labels }
  }

  async getRevenueByMonth(title = undefined) {
    const labels = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']
    const data = []
    const currentYearNumber = new Date().getFullYear()
    let currentMonth = new Date(`${currentYearNumber}.01.01`).getTime()
    let nextMonth = 0
    for (let i = 0; i < labels.length; i += 1) {
      nextMonth = currentMonth + 2629800000 // ms in a month
      const query = { start: { $gte: currentMonth, $lte: nextMonth } }
      if (title) query.title = title
      const rentList = await this.Rentals.find(query, 'price').exec()
      const price = rentList ? rentList.reduce((accumulator, rent) => accumulator + rent.price, 0) : 0
      data.push(price)
      currentMonth = nextMonth
    }
    return { data, labels }
  }

  async avgRentByMonth(title = undefined) {
    const query = {}
    if (title) query.title = title
    const data = (await this.Rentals.find(query).exec()).length || 0
    return Math.ceil(data / 12)
  }

  async countStatus(title = undefined) {
    const today = new Date().getTime()
    const queryActive = { status: 'Noleggiato', start: { $lte: today }, end: { $gte: today } }
    const queryFuture = { status: 'Noleggiato', start: { $gt: today } }
    if (title) {
      queryActive.title = title
      queryFuture.title = title
    }
    const noleggiati = (await this.Rentals.find(queryActive).exec()).length || 0
    const prenotati = (await this.Rentals.find(queryFuture).exec()).length || 0
    return { data: [noleggiati, prenotati], labels: ['Noleggiati', 'Prenotati'] }
  }

  async countConditions(title = undefined) {
    const query = {}
    if (title) query.title = title
    query.condition = 'Ottima'
    const ottima = (await this.Inventory.find(query).exec()).length || 0
    query.condition = 'Buona'
    const buona = (await this.Inventory.find(query).exec()).length || 0
    query.condition = 'Parzialmente danneggiato'
    const pd = (await this.Inventory.find(query).exec()).length || 0
    const labels = ['Ottimo', 'Buono', 'Parzialmente danneggiato']
    return { labels, data: [ottima, buona, pd] }
  }

  async avgRentLength(title = undefined) {
    let query = {}
    if (title) query = { title }
    const rentals = await this.Rentals.find(query).exec()
    const totalTime = rentals.reduce((accomulator, rent) => accomulator + (rent.end - rent.start), 0)
    const totalDays = totalTime / 86400000 // ms in a day
    return Math.ceil(totalDays / rentals.length)
  }
}

export default Operation
