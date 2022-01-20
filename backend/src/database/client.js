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

  async addClient(email, password) {
    const client = await new this.Clients({
      email,
      password,
    }).save()
    delete client.password // security (la password è comunque cryptata)
    return client
  }

  async updateClient({ id, email, preferredCategories, payment, fidelityPoints, description, favourites, notifications }) {
    return this.Clients.findOneAndUpdate({ id, email }, { preferredCategories, payment, fidelityPoints, description, favourites, notifications })
  }

  async findClient(email) {
    return this.Clients.findOne({ email }, 'email preferredCategories payment fidelityPoints favourites notifications').exec()
  }

  async lookupClient(email) {
    return this.Clients.findOne({ email }, 'email preferredCategories payment fidelityPoints favourites notifications').exec()
  }
}
export default Client
