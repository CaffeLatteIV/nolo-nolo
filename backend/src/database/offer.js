import mongoose from 'mongoose'
import { offerSchema } from './schema.js'

class Offer {
  constructor() {
    this.URL = process.env.URL || 'mongodb://localhost:27017/nolo-nolo'
    this.connect()
  }

  async connect() {
    this.mongoose = await mongoose.connect(this.URL)
    this.Offer = mongoose.model('offers', offerSchema)
  }

  async getOffer(start, end) {
    await this.connect()
    // cerca un'offerta che abbia l'inizio o la fine nel range cercato
    return this.Offer.find({
      $or: [
        { start: { $gte: start, $lte: end } },
        { end: { $gte: start, $lte: end } }],
    }).exec()
  }
}
export default Offer
