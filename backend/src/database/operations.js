import mongoose from 'mongoose'
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
    const rentals = await this.Rentals.find().lean().exec()
    const uniqueItems = {}
    rentals.forEach((item) => {
      const productCode = item.productCode.valueOf()
      if (uniqueItems[productCode] === undefined) {
        uniqueItems[productCode] = 1
      } else {
        uniqueItems[productCode] += 1
      }
    })
    console.log(uniqueItems)
    const itemsArr = Object.keys(uniqueItems).sort((a, b) => uniqueItems[a] - uniqueItems[b]).slice(0, n - 1)
    console.log(itemsArr)
    const res = []
    for (let i = 0; i < itemsArr.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      res.push(await this.Inventory.findById(itemsArr[i]).exec())
    }
    return res
  }
}
export default Operation
