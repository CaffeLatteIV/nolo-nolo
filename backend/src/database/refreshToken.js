import mongoose from 'mongoose'
import { refreshTokenSchema } from './schema.js'

class RefreshToken {
  constructor() {
    this.URL = process.env.URL || 'mongodb://localhost:27017/nolo-nolo'
    this.connect()
  }

  async connect() {
    this.mongoose = await mongoose.connect(this.URL)
    this.RefreshToken = mongoose.model('refreshTokens', refreshTokenSchema)
  }

  async addRefreshToken(token) {
    await new this.RefreshToken({ token }).save()
  }

  async findToken(token) {
    return this.RefreshToken.findOne({ token }).exec()
  }

  async deleteToken(token) {
    const tokenFound = await this.findToken(token)
    if (!tokenFound) return undefined
    return this.RefreshToken.deleteOne({ token }).exec()
  }
}
export default RefreshToken
