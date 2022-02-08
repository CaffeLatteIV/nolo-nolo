import mongoose from 'mongoose'
import { couponSchema } from './schema.js'

class Coupon {
  constructor() {
    this.URL = process.env.URL || 'mongodb://localhost:27017/nolo-nolo'
    this.connect()
  }

  async connect() {
    this.mongoose = await mongoose.connect(this.URL)
    this.Coupon = mongoose.model('coupons', couponSchema)
  }

  async addCoupon({ title, discount, start, end, usage }) {
    return new this.Coupon({ title, discount, start, end, usage }).save()
  }

  async removeCoupon(id) {
    return this.Coupon.findByIdAndDelete(id).exec()
  }

  async useCoupon(id, clientCode) {
    const coupon = await this.Coupon.findById(id).exec()
    if (!coupon) throw new Error('Invalid coupon')
    const { start, end, clients, discount } = coupon
    let { usage } = coupon
    const today = new Date().getTime()
    if (clients.include(clientCode)) return undefined
    if (start !== 0 && end !== 0 && start <= today && end >= today) {
      await this.Coupon.findByIdAndUpdate(id, { clients }).exec()
      return discount
    }
    if (usage > 0) {
      usage -= 1
      await this.Coupon.findByIdAndUpdate(id, { clients, usage }).exec()
      return discount
    }
    throw new Error('Coupon malformed')
  }

  async listAll() {
    const coupons = await this.Coupon.find().exec()
    return coupons.sort((a, b) => a.end - b.end)
  }
}
export default Coupon
