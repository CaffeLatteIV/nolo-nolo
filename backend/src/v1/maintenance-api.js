import Express from 'express'
import Maintenance from '../database/maintenance.js'
import loggerWrapper from '../logger.js'
import { authenticateAccessToken, authenticateUserRole } from '../utils/authenticate.js'

const db = new Maintenance()
const logger = loggerWrapper('Maintenance API')
const app = Express.Router()

app.post('/add', authenticateAccessToken, authenticateUserRole, async (req, res) => {
  const { maintenance } = req.body
  logger.info('Adding new Coupon ')
  if (!maintenance) {
    logger.warn('Missing maintenance data')
    return res.status(404).send({ code: 404, msg: 'Missing maintenance data' })
  }
  const newMaintenance = await db.addMaintenace(maintenance)
  return res.status(200).send({ maintenance: newMaintenance }) // per comodità
})
app.delete('/remove/:productCode', authenticateAccessToken, authenticateUserRole, async (req, res) => {
  const { productCode } = req.params
  if (!productCode) return res.status(404).send({ code: 404, msg: 'No productCode received' })
  logger.info(`received a request to remove ${productCode}`)

  const maintenanceDeleted = await db.removeMaintenance(productCode)
  if (maintenanceDeleted === undefined) {
    logger.warn('No coupon found')
    return res.status(400).send({ code: 404, msg: 'No coupon found' })
  }
  return res.status(200).send({ code: 200, msg: 'Removed' })
})
app.get('/get/:productCode', authenticateAccessToken, authenticateUserRole, async (req, res) => {
  const { productCode } = req.params
  if (!productCode) {
    logger.warn('Product code is missing')
    return res.status(404).send({ code: 404, msg: 'No coupon received' })
  }
  const maintenanceList = await db.getMaintenanceList(productCode)
  return res.status(200).send({ maintenanceList })
})
app.post('/verify/rent/:rentID', authenticateAccessToken, authenticateUserRole, async (req, res) => {
  const { rentID } = req.params
  if (!rentID) {
    logger.warn('Rent ID is missing')
    return res.status(404).send({ code: 404, msg: 'No coupon received' })
  }
  const verifyRent = await db.verifyRent(rentID)
  return res.status(200).send({ verifyRent })
})

export default app
