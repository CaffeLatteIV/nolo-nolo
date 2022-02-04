import mongoose from 'mongoose'
import { employeeSchema } from './schema.js'

class Employee {
  constructor() {
    this.Employee = mongoose.model('employees', employeeSchema)
  }

  async addEmployee(email, password, role) {
    let employee = await this.lookupEmployee(email)
    if (employee) return undefined
    employee = await new this.Employee({
      email,
      password,
      role,
    }).save()
    delete employee.password // security (la password è comunque cryptata)
    return employee
  }

  async login(email, password) {
    return this.Employee.findOne({ email, password }, 'email role').exec()
  }

  async lookupEmployee(email) {
    return this.Employee.findOne({ email }, 'email role').exec()
  }
}
export default Employee
