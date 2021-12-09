import mongoose from 'mongoose'
import { rentSchema } from './schema.js'

class Employee {
  constructor() {
    this.URL = (process.env.URL || 'mongodb://localhost:27017/nolo-nolo')
  }

  async connect() {
    this.mongoose = await mongoose.connect(this.URL)
    this.Employee = mongoose.model('rentals', rentSchema)
  }

  async addEmployee({ username, password, role }) {
    const employee = await this.findEmployee(username, password)
    if (employee) throw new Error('Employee already registered')
    await new this.Employee({
      username,
      password,
      role,
    }).save()
  }

  async findEmployee(username, password) {
    return this.Rentals.findOne({ username, password }).exec()
  }

  async lookupEmployee(username) {
    return this.Rentals.findOne({ username }).exec()
  }
}
export default Employee
