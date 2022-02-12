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
    return this.Rental.findByIdAndUpdate(rentCode, { verified: true }).exec()
  }
}
export default Maintenance
