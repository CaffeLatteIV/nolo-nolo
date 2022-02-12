import mongoose from 'mongoose'
import { maintenanceSchema, rentSchema } from './schema.js'

class Maintenance {
  constructor() {
    this.URL = process.env.URL || 'mongodb://localhost:27017/nolo-nolo'
    this.connect()
  }

  async connect() {
    this.mongoose = await mongoose.connect(this.URL)
    this.Maintenance = mongoose.model('maintenance', maintenanceSchema)
    this.Rental = mongoose.model('rentals', rentSchema)
  }

  async addMaintenance({ productCode, start, end }) {
    return new this.Maintenance({ productCode, start, end }).save()
  }

  async removeMaintenance(productCode) {
    return this.Maintenance.deleteMany({ productCode }).exec()
  }

  async getMaintenanceList(productCode) {
    return this.Maintenance.find({ productCode }).exec()
  }

  async verifyRent(rentCode) {
    return this.Rental.findByIdAndUpdate(rentCode, { verifiedRent: true }).exec()
  }

  async verifyPayment(rentCode) {
    return this.Rental.findByIdAndUpdate(rentCode, { verifiedPayment: true }).exec()
  }
}
export default Maintenance
