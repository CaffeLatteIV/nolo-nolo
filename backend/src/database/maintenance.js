import mongoose from 'mongoose'
import { maintenanceSchema } from './schema.js'

class Maintenance {
  constructor() {
    this.Maintenance = mongoose.model('maintenance', maintenanceSchema)
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
}
export default Maintenance
