import mongoose from 'mongoose'
import { clientSchema } from './schema.js'

class Client {
  constructor() {
    this.Clients = mongoose.model('clients', clientSchema)
  }

  async addClient({ email, password, name, surname, phoneNumber, birthDate, gender, address, favourites, preferredCategories, fidelityPoints }) {
    const client = await new this.Clients({
      email,
      password,
      name,
      surname,
      birthDate,
      address,
      gender,
      phoneNumber,
      preferredCategories,
      favourites,
      fidelityPoints,
    }).save()
    delete client.password // security (la password è comunque cryptata)
    return client
  }

  async updatePersonalInfo({ id, name, surname, phoneNumber, birthDate, email, gender, address }) {
    return this.Clients.findByIdAndUpdate(id, {
      name,
      surname,
      email,
      birthDate,
      address,
      gender,
      phoneNumber,
    })
  }

  async updatePreferences({ id, favourites, preferredCategories, fidelityPoints }) {
    return this.Clients.findByIdAndUpdate(id, {
      preferredCategories,
      favourites,
      fidelityPoints,
    })
  }

  async login(email, password) {
    return this.Clients.findOne({ email, password }, 'email name surname phoneNumber birthDate email gender address preferredCategories payment fidelityPoints favourites ').exec()
  }

  async lookupClient(id) {
    return this.Clients.findById(id, 'email name surname phoneNumber birthDate email gender address preferredCategories payment fidelityPoints favourites').exec()
  }

  async getClientList() {
    return this.Clients.find({}, 'email name surname phoneNumber birthDate email gender address preferredCategories payment fidelityPoints favourites').exec()
  }

  async findClient(email, password) {
    return this.Clients.findOne({ email, password }, 'name').exec()
  }

  async findEmail(email) {
    return this.Clients.findOne({ email }, 'name').exec()
  }

  async removeClient(id) {
    return this.Clients.findByIdAndDelete(id).exec()
  }
}
export default Client
