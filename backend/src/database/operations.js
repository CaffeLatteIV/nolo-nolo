/* eslint-disable no-await-in-loop */
/* eslint-disable dot-notation */
import mongoose from 'mongoose'
import { closest, distance } from 'fastest-levenshtein'
import { clientSchema, inventorySchema, rentSchema } from './schema.js'

class Operation {
  constructor() {
    this.URL = process.env.URL || 'mongodb://localhost:27017/nolo-nolo'
    this.connect()
  }

  async connect() {
    this.mongoose = await mongoose.connect(this.URL)
    this.Inventory = mongoose.model('inventories', inventorySchema)
    this.Rentals = mongoose.model('rentals', rentSchema)
    this.Clients = mongoose.model('clients', clientSchema)
  }

  async findbestSellers(n = 3) {
    await this.connect()
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
    const itemsArr = Object.keys(uniqueItems).sort((a, b) => uniqueItems[a] - uniqueItems[b]).slice(0, n - 1) // prendo i n-titoli più venduti
    const res = []
    for (let i = 0; i < itemsArr.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      res.push(await this.Inventory.findById(itemsArr[i]).exec()) // restituisco gli oggetti corrispondenti ai titoli
    }
    return res
  }

  // utilizza la distanza di levenshtein https://en.wikipedia.org/wiki/Levenshtein_distance
  async findSimilarTitle(title) {
    await this.connect()
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
    await this.connect()
    const data = {}
    data.u17 = (await this.Clients.find({ age: { $lte: 17 } }).exec()).length || 0
    data.u24 = (await this.Clients.find({ age: { $gte: 18, $lte: 24 } }).exec()).length || 0
    data.u34 = (await this.Clients.find({ age: { $gte: 24, $lte: 34 } }).exec()).length || 0
    data.u44 = (await this.Clients.find({ age: { $gte: 34, $lte: 44 } }).exec()).length || 0
    data.u54 = (await this.Clients.find({ age: { $gte: 44, $lte: 54 } }).exec()).length || 0
    data.u64 = (await this.Clients.find({ age: { $gte: 54, $lte: 64 } }).exec()).length || 0
    data.o65 = (await this.Clients.find({ age: { $gte: 65 } }).exec()).length || 0
    const labels = ['0-17', '18-24', '25-34', '35-44', '45-54', '55-64', '65+']
    return { data, labels }
  }

  async countGender() {
    await this.connect()
    const data = {}
    data.Maschio = (await this.Clients.find({ gender: 'Maschio' }).exec()).length || 0
    data.Femmina = (await this.Clients.find({ gender: 'Femmina' }).exec()).length || 0
    data.NS = (await this.Clients.find({ gender: 'Non specificato' }).exec()).length || 0
    const labels = ['Maschio', 'Femmina', 'Non specificato']
    return { data, labels }
  }

  async getRevenueByMonth(title = undefined) {
    await this.connect()
    const labels = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']
    const data = { Gennaio: 4 }
    const currentYearNumber = new Date().getFullYear()
    let currentMonth = new Date(`${currentYearNumber}.01.01`).getTime()
    let nextMonth = 0
    for (let i = 0; i < labels.length; i += 1) {
      nextMonth = currentMonth + 2629800000 // ms in a month
      const query = { start: { $gte: currentMonth, $lte: nextMonth } }
      if (title) query.title = title
      const revenue = await this.Rentals.find(query).exec()
      if (revenue) return revenue.reduce((a, b) => a.price + b.price)
      data[labels[i]] = revenue
      currentMonth = nextMonth
    }
    return { data, labels }
  }

  async countStatus(title = undefined) {
    await this.connect()
    const today = new Date().getTime()
    const query = { start: { $gte: today } }
    if (title) query.title = title
    query.status = 'Noleggiato'
    const noleggiati = (await this.Rentals.find(query)).length || 0
    query.status = 'Prenotato'
    const prenotati = (await this.Rentals.find(query)).length || 0
    return { data: [noleggiati, prenotati], labels: ['Noleggiati', 'Prenotati'] }
  }

  async countConditions(title = undefined) {
    await this.connect()
    const today = new Date().getTime()
    const query = { start: { $gte: today } }
    if (title) query.title = title
    query.condition = 'Ottima'
    const ottima = (await this.Rentals.find(query)).length || 0
    query.condition = 'Buona'
    const buona = (await this.Rentals.find(query)).length || 0
    query.condition = 'Parzialmente danneggiato'
    const pd = (await this.Rentals.find(query)).length || 0
    const labels = ['Ottimo', 'Buono', 'Parzialmente danneggiato']
    return { labels, data: [ottima, buona, pd] }
  }

  async avgRent(clientCode = undefined) {
    await this.connect()
    let query = {}
    if (clientCode) query = { clientCode }
    const rentals = await this.Rentals.find(query).exec()
    let totalTime = 0
    rentals.forEach((rent) => {
      totalTime += rent.end - rent.start
    })
    const totalDays = totalTime / 86400000 // ms in a day
    return totalDays / rentals.length
  }
}

export default Operation
