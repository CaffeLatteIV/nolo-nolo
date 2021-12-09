import mongoose from 'mongoose'
import { clientSchema } from './schema'

class Client {
  constructor() {
    this.connect()
    this.URL = (process.env.URL || 'mongodb://localhost:27017/nolo-nolo')
  }

  async connect() {
    this.mongoose = await mongoose.connect(this.URL)
    this.Clients = mongoose.model('clients', clientSchema)
  }

  async addClients({ username, password, preferredCategories, payment, fidelityPoints, description, favourites, notifications }) {
    const client = await this.findClient(username, password)
    if (client) throw new Error('Client already registered')
    await new this.Clients({
      username,
      password,
      preferredCategories,
      payment,
      fidelityPoints,
      description,
      favourites,
      notifications,
    }).save()
  }

  async findClient(username, password) {
    return this.Clients.findOne({ username, password }, 'username preferredCategories payment fidelityPoints favourites notifications').exec()
  }

  async lookupClient(username) {
    return this.Clients.findOne({ username }, 'username preferredCategories payment fidelityPoints favourites notifications').exec()
  }
}
export default Client
