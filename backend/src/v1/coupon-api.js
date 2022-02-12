import Express from 'express'
import Coupon from '../database/coupon.js'
import loggerWrapper from '../logger.js'
import { authenticateAccessToken, authenticateUserRole } from '../utils/authenticate.js'

const db = new Coupon()
const logger = loggerWrapper('Coupon API')
const app = Express.Router()

app.post('/add', authenticateAccessToken, authenticateUserRole, async (req, res) => {
  const { coupon } = req.body
  logger.info('Adding new Coupon ')
  if (!coupon) return res.status(404).send({ code: 404, msg: 'Missing coupon data' })
  const newCoupon = await db.addCoupon(coupon)
  return res.status(200).send({ coupon: newCoupon }) // per comodità
})
app.delete('/remove/:id', authenticateAccessToken, authenticateUserRole, async (req, res) => {
  const { id } = req.params
  if (!id) return res.status(404).send({ code: 404, msg: 'No coupon received' })
  logger.info(`received a request to remove ${id}`)

  const couponDeleted = await db.removeCoupon(id)
  if (couponDeleted === undefined) {
    logger.warn('No coupon found')
    return res.status(400).send({ code: 404, msg: 'No coupon found' })
  }
  return res.status(200).send({ code: 200, msg: 'Removed' })
})
app.post('/use', authenticateAccessToken, async (req, res) => {
  try {
    const { title, clientCode } = req.body
    logger.info(`Requested coupon {${title}}`)
    const discount = await db.useCoupon(title, clientCode)
    return res.status(200).send({ discount })
  } catch (err) {
    logger.error(err.message)
    return res.status(500).send({ code: 500, msg: 'Internal server error' })
  }
})
app.get('/list', authenticateAccessToken, authenticateUserRole, async (req, res) => {
  try {
    logger.info('Requested to show all coupons in the db')
    const coupons = await db.listAll()
    return res.status(200).send({ coupons })
  } catch (err) {
    logger.error(err.message)
    return res.status(500).send({ code: 500, msg: 'Internal server error' })
  }
})

export default app
