import mongoose from 'mongoose'
import { maintenanceSchema, rentSchema } from './schema.js'

class Maintenance {
  constructor() {
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
    // findByIdAndUpdate ritorna il documento PRECEDENTE
    await this.Rental.findByIdAndUpdate(rentCode, { verifiedRent: true })
    return this.Rental.findById(rentCode).exec()
  }

  async verifyReturn(rentCode) {
    // findByIdAndUpdate ritorna il documento PRECEDENTE
    await this.Rental.findByIdAndUpdate(rentCode, { verifiedReturn: true })
    return this.Rental.findById(rentCode).exec()
  }
}
export default Maintenance
