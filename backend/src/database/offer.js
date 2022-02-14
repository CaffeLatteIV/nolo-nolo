import mongoose from 'mongoose'
import { offerSchema } from './schema.js'

class Offer {
  constructor() {
    this.Offer = mongoose.model('offers', offerSchema)
  }

  async getOffer(start, end) {
    // cerca un'offerta che abbia l'inizio o la fine nel range cercato
    return this.Offer.find({
      $or: [
        { start: { $gte: start, $lte: end } },
        { end: { $gte: start, $lte: end } }],
    }).exec()
  }
}
export default Offer
