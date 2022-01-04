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

  async addEmployee({ email, password, role }) {
    const employee = await this.lookupEmployee(email)
    console.log(employee)
    if (employee) return undefined
    return new this.Employee({
      email,
      password,
      role,
    }).save()
  }

  async findEmployee(email, password) {
    return this.Employee.findOne({ email, password }, 'email role').exec()
  }

  async lookupEmployee(email) {
    return this.Employee.findOne({ email }, 'email role').exec()
  }
}
export default Employee
