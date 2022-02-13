import Express from 'express'
import dayjs from 'dayjs'
import Rental from '../database/rental.js'
import { authenticateAccessToken, authenticateUserRole } from '../utils/authenticate.js'
import loggerWrapper from '../logger.js'

const logger = loggerWrapper('Rental API')
const db = new Rental()
const app = Express.Router()

app.post('/receipt', authenticateAccessToken, async (req, res) => {
  try {
    const { productCode, clientCode, start, end, useFidelityPoints, coupon } = req.body
    if (!productCode || !clientCode || !start || !end) {
      logger.error('Missing data to add')
      return res.status(404).send({ code: 404, msg: 'Missing product to add' })
    }
    const available = await db.checkAvailability(start, end, productCode)
    if (!available) {
      logger.info('Selected dates are not available for this product')
      return res.status(402).send({ code: 402, msg: 'Selected dates are not available for this product' })
    }
    const receipt = await db.calculateReceipt(productCode, clientCode, start, end, useFidelityPoints, coupon)
    logger.info(`A user requested a receipt for a rent from ${dayjs(start).format('DD/MM/YYYY')} to ${dayjs(end).format('DD/MM/YYYY')}`)
    return res.status(200).send({ receipt })
  } catch (err) {
    logger.error(err.message)
    logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'There was an error while uploading data, try again' })
  }
})
app.post('/add', authenticateAccessToken, async (req, res) => {
  try {
    const { rentalInfo } = req.body
    if (!rentalInfo) {
      logger.error('Missing data to add')
      return res.status(404).send({ code: 404, msg: 'Missing product to add' })
    }
    const available = await db.checkAvailability(rentalInfo.start, rentalInfo.end, rentalInfo.productCode)
    if (!available) {
      logger.info('Selected dates are not available for this product')
      return res.status(402).send({ code: 402, msg: 'Selected dates are not available for this product' })
    }
    await db.addRental(rentalInfo)
    logger.info(`A user rented a new product: ${rentalInfo.productCode}`)
    return res.status(200).send({ code: 200, msg: 'Rental added' })
  } catch (err) {
    logger.error(err.message)
    logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'There was an error while uploading data, try again' })
  }
})
app.get('/clients/:clientCode', authenticateAccessToken, async (req, res) => {
  try {
    const { clientCode } = req.params
    if (!clientCode) {
      logger.error('Client code is missing')
      return res.status(404).send({ code: 404, msg: 'Client code is missing' })
    }
    const rent = await db.findUserRentals(clientCode)
    if (rent === null) {
      logger.warn('Client has made no rental')
      return res.status(404).send({ code: 400, msg: 'Not found' })
    }
    logger.info('Sending user rentals')
    return res.status(200).send({ rent })
  } catch (err) {
    logger.error(err.message)
    logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'There was an error while performing the request, try again' })
  }
})
app.get('/find/:productCode', authenticateAccessToken, async (req, res) => {
  try {
    const { productCode } = req.params
    if (!productCode) {
      logger.error('Missing productCode')
      return res.status(404).send({ code: 404, msg: 'Missing productCode' })
    }
    const rent = await db.findProductRentals(productCode)
    if (rent.length === 0) return res.status(404).send({ code: 404, msg: 'Not found' }) // può essere cambiato e restituire solo l'array vuoto
    return res.status(200).send(rent)
  } catch (err) {
    logger.error(err.message)
    logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'There was an error while performing the request, try again' })
  }
})

app.get('/find/date/end', authenticateAccessToken, async (req, res) => {
  try {
    const { date } = req.body
    if (!date) {
      logger.error('Missing date')
      return res.status(404).send({ code: 404, msg: 'Missing date' })
    }
    const rent = await db.findEndings(date)
    if (rent.length === 0) return res.status(404).send({ code: 404, msg: 'Not found' }) // può essere cambiato e restituire solo l'array vuoto
    return res.status(200).send({ rent })
  } catch (err) {
    logger.error(err.message)
    logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'There was an error while performing the request, try again' })
  }
})
app.post('/paymentInfo/:rentId', authenticateAccessToken, async (req, res) => {
  try {
    const { rentId } = req.params
    if (!rentId) {
      logger.error('ProductCode is undefined')
      return res.status(404).send({ code: 404, msg: 'Not found' })
    }
    const rent = await db.summarizePayment(rentId)
    return res.status(200).send({ ...rent })
  } catch (err) {
    logger.error('Error while paying rent')
    logger.error(err.message)
    logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'There was an error while performing the request, try again' })
  }
})
app.post('/pay/:rentId', authenticateAccessToken, async (req, res) => {
  try {
    const { rentId } = req.params
    if (!rentId) {
      logger.error('ProductCode is undefined')
      return res.status(404).send({ code: 404, msg: 'Not found' })
    }
    await db.payRent(rentId)
    return res.status(200).send({ code: 200, msg: 'ok' })
  } catch (err) {
    logger.error('Error while paying rent')
    logger.error(err.message)
    logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'There was an error while performing the request, try again' })
  }
})
app.post('/available', authenticateAccessToken, async (req, res) => {
  try {
    const { start, end, productCode } = req.body
    if (!start || !end || !productCode) {
      logger.error('Missing date or product code')
      return res.status(404).send({ code: 404, msg: 'Missing date' })
    }
    logger.info('Verifying availability for the requested dates')
    const available = await db.checkAvailability(start, end, productCode)
    if (available) {
      logger.info('Product is available')
      return res.status(200).send({ available })
    }
    logger.info('Produtct not available')
    return res.status(409).send({ code: 409, msg: 'Selected period is not available' })
  } catch (err) {
    logger.error(err.message)
    logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'There was an error while performing the request, try again' })
  }
})
app.get('/find/date/start', async (req, res) => {
  try {
    const { date } = req.body
    if (!date) {
      logger.error('Missing date')
      return res.status(404).send({ code: 404, msg: 'Missing date' })
    }
    const rent = await db.findStarts(date)
    if (rent.length === 0) return res.status(404).send({ code: 404, msg: 'Not found' }) // può essere cambiato e restituire solo l'array vuoto
    return res.status(200).send({ rent })
  } catch (err) {
    logger.error(err.message)
    logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'There was an error while performing the request, try again' })
  }
})
app.post('/getActiveRentals', async (req, res) => {
  const { clientCode, start } = req.body
  if (!clientCode || !start) {
    logger.error('Missing date or client code')
    return res.status(404).send({ code: 404, msg: 'Missing date' })
  }
  const rentals = await db.getUserActiveRentals(start, clientCode)
  return res.status(200).send({ rentals })
})
app.get('/all', authenticateAccessToken, authenticateUserRole, async (req, res) => {
  try {
    const rentals = await db.getAllRentals()
    return res.status(200).send({ rentals })
  } catch (err) {
    return res.status(500).send({ code: 500, msg: 'Internal server error' })
  }
})
app.post('/delete/:rentalId', authenticateAccessToken, authenticateUserRole, async (req, res) => {
  try {
    const { rentalId } = req.params
    const rentals = await db.deleteRental(rentalId)
    return res.status(200).send({ rentals })
  } catch (err) {
    return res.status(500).send({ code: 500, msg: 'Internal server error' })
  }
})
app.get('/find', async (req, res) => {
  try {
    const { productCode, clientCode } = req.body
    const rent = await db.find(productCode, clientCode)
    if (rent.length === 0) return res.status(404).send({ code: 404, msg: 'Not found' })// può essere cambiato e restituire solo l'array vuoto
    return res.status(200).send({ rent })
  } catch (err) {
    logger.error(err.message)
    logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'There was an error while performing the request, try again' })
  }
})

export default app
