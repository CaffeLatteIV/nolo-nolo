import mongoose from 'mongoose'
import { clientSchema } from './schema.js'

class Client {
  constructor() {
    this.URL = process.env.URL || 'mongodb://localhost:27017/nolo-nolo'
    this.connect()
  }

  async connect() {
    this.mongoose = await mongoose.connect(this.URL)
    this.Clients = mongoose.model('clients', clientSchema)
  }

  async addClients({ username, password }) {
    const client = await this.Clients.findOne({ username })
    if (client) return undefined
    return new this.Clients({
      username,
      password,
    }).save()
  }

  async updateClient({ username, preferredCategories, payment, fidelityPoints, description, favourites, notifications }) {
    return this.Clients.findOneAndUpdate({ username }, { preferredCategories, payment, fidelityPoints, description, favourites, notifications })
  }

  async findClient(username, password) {
    return this.Clients.findOne({ username, password }, 'username preferredCategories payment fidelityPoints favourites notifications').exec()
  }

  async lookupClient(username) {
    return this.Clients.findOne({ username }, 'username preferredCategories payment fidelityPoints favourites notifications').exec()
  }
}
export default Client
