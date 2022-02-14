import mongoose from 'mongoose'
import { couponSchema } from './schema.js'

class Coupon {
  constructor() {
    this.Coupon = mongoose.model('coupons', couponSchema)
  }

  async addCoupon({ title, discount, start, end, usage }) {
    return new this.Coupon({ title, discount, start, end, usage }).save()
  }

  async removeCoupon(id) {
    return this.Coupon.findByIdAndDelete(id).exec()
  }

  async useCoupon(title, clientCode) {
    const coupon = await this.Coupon.findOne({ title }).exec()
    if (!coupon) throw new Error('Invalid coupon')
    const { start, end, clients, discount } = coupon
    let { usage } = coupon
    const today = new Date().getTime()
    if (clients && clients.includes(clientCode)) return undefined // il cliente ha già usato il coupon
    clients.push(clientCode)
    if (start !== 0 && end !== 0 && start <= today && end >= today) { // coupon a tempo
      await this.Coupon.findByIdAndUpdate(coupon.id, { clients }).exec()
      return discount
    }
    if (usage > 0) { // coupon ad usi
      usage -= 1
      await this.Coupon.findByIdAndUpdate(coupon.id, { clients, usage }).exec()
      return discount
    }
    return undefined
  }

  async listAll() {
    const coupons = await this.Coupon.find().exec()
    return coupons.sort((a, b) => a.end - b.end) // prima i coupon in scadenza
  }
}
export default Coupon
