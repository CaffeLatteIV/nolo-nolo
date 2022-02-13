import Express from 'express'
import Maintenance from '../database/maintenance.js'
import loggerWrapper from '../logger.js'
import { authenticateAccessToken, authenticateUserRole } from '../utils/authenticate.js'

const db = new Maintenance()
const logger = loggerWrapper('Maintenance API')
const app = Express.Router()

app.post('/add', authenticateAccessToken, authenticateUserRole, async (req, res) => {
  const { maintenance } = req.body
  logger.info('Adding new maintenance ')
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
    logger.warn('No maintenance found')
    return res.status(400).send({ code: 404, msg: 'No maintenance found' })
  }
  return res.status(200).send({ code: 200, msg: 'Removed' })
})
app.get('/get/:productCode', authenticateAccessToken, authenticateUserRole, async (req, res) => {
  const { productCode } = req.params
  if (!productCode) {
    logger.warn('Product code is missing')
    return res.status(404).send({ code: 404, msg: 'Product code is missing' })
  }
  const maintenanceList = await db.getMaintenanceList(productCode)
  return res.status(200).send({ maintenanceList })
})
app.post('/verify/rent/:rentID', authenticateAccessToken, authenticateUserRole, async (req, res) => {
  const { rentID } = req.params
  if (!rentID) {
    logger.warn('Rent ID is missing')
    return res.status(404).send({ code: 404, msg: 'Rent ID is missing' })
  }
  const { verifiedRent } = await db.verifyRent(rentID)
  return res.status(200).send({ verifiedRent })
})
app.post('/verify/return/:rentID', async (req, res) => {
  try {
    const { rentID } = req.params
    if (!rentID) {
      logger.warn('Rent ID is missing')
      return res.status(404).send({ code: 404, msg: 'Rent ID is missing' })
    }
    const { verifiedReturn } = await db.verifyReturn(rentID)
    return res.status(200).send({ verifiedReturn })
  } catch (err) {
    logger.error(err.message)
    logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'Internal server error' })
  }
})

export default app
