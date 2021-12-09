import mongoose from 'mongoose'
import { employeeSchema } from './schema.js'

class Employee {
  constructor() {
    this.URL = process.env.URL || 'mongodb://localhost:27017/nolo-nolo'
    this.connect()
  }

  async connect() {
    this.mongoose = await mongoose.connect(this.URL)
    this.Employee = mongoose.model('employees', employeeSchema)
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
    return this.Employee.findOne({ username, password }).exec()
  }

  async lookupEmployee(username) {
    return this.Employee.findOne({ username }).exec()
  }
}
export default Employee
