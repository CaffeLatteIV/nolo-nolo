import mongoose from 'mongoose'
import { maintenanceSchema } from './schema.js'

class Maintenance {
  constructor() {
    this.URL = process.env.URL || 'mongodb://localhost:27017/nolo-nolo'
    this.connect()
  }

  async connect() {
    this.mongoose = await mongoose.connect(this.URL)
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
