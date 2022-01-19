/* eslint-disable dot-notation */
import mongoose from 'mongoose'
import { closest } from 'fastest-levenshtein'
import { inventorySchema, rentSchema } from './schema.js'

class Operation {
  constructor() {
    this.URL = process.env.URL || 'mongodb://localhost:27017/nolo-nolo'
    this.connect()
  }

  async connect() {
    this.mongoose = await mongoose.connect(this.URL)
    this.Inventory = mongoose.model('inventories', inventorySchema)
    this.Rentals = mongoose.model('rentals', rentSchema)
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
    const productList = await this.Inventory.find({}, 'title').exec() // restituisce sia il titolo che l'id corrispondente all'oggetto
    const titleList = productList.map((product) => product.title) // estraggo solo il titolo
    const closestTitle = closest(title, titleList) // trovo il titolo più simile
    return productList.filter((product) => product.title === closestTitle) // ritorno tutti gli oggetti con lo stesso titolo + il loro ID
  }
}

export default Operation
