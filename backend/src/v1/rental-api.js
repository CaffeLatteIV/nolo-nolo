import Express from 'express'
import Rental from '../database/rental.js'
// import loggerWrapper from '../logger.js'
import { authenticateAccessToken } from '../utils/authenticate.js'

// const logger = loggerWrapper('Rental API')
const db = new Rental()
const app = Express.Router()

app.post('/add', authenticateAccessToken, async (req, res) => {
  try {
    const { product } = req.body
    if (!product) {
      // logger.error('Missing product to add')
      return res.status(404).send({ code: 404, msg: 'Missing product to add' })
    }
    const available = await db.checkAvailability(product.start, product.end, product.productCode)
    if (!available) {
      // logger.info('Selected dates are not available for this product')
      return res.status(402).send({ code: 402, msg: 'Selected dates are not available for this product' })
    }
    await db.addRentals(product)
    // logger.info(`A user rented a new product: ${product.productCode}`)
    return res.status(200).send({ code: 200, msg: 'Rental added' })
  } catch (err) {
    // logger.error(err.message)
    // logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'There was an error while uploading data, try again' })
  }
})
app.get('/clients/:clientCode', authenticateAccessToken, async (req, res) => {
  try {
    const { clientCode } = req.params
    const rent = await db.findUserRentals(clientCode)
    if (rent === null) return res.status(404).send({ code: 400, msg: 'Not found' })
    return res.status(200).send(rent)
  } catch (err) {
    // logger.error(err.message)
    // logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'There was an error while performing the request, try again' })
  }
})
app.get('/find/:productCode', authenticateAccessToken, async (req, res) => {
  try {
    const { productCode } = req.params
    if (!productCode) {
      // logger.error('Missing productCode')
      return res.status(404).send({ code: 404, msg: 'Missing productCode' })
    }
    const rent = await db.findProductRentals(productCode)
    if (rent.length === 0) return res.status(404).send({ code: 404, msg: 'Not found' }) // può essere cambiato e restituire solo l'array vuoto
    return res.status(200).send(rent)
  } catch (err) {
    // logger.error(err.message)
    // logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'There was an error while performing the request, try again' })
  }
})

app.get('/find/date/end', authenticateAccessToken, async (req, res) => {
  try {
    const { date } = req.body
    if (!date) {
      // logger.error('Missing date')
      return res.status(404).send({ code: 404, msg: 'Missing date' })
    }
    const rent = await db.findEndings(date)
    if (rent.length === 0) return res.status(404).send({ code: 404, msg: 'Not found' }) // può essere cambiato e restituire solo l'array vuoto
    return res.status(200).send({ rent })
  } catch (err) {
    // logger.error(err.message)
    // logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'There was an error while performing the request, try again' })
  }
})
app.get('/pay/:rentId', authenticateAccessToken, async (req, res) => {
  try {
    const { rentId } = req.params
    if (!rentId) {
      // logger.error('ProductCode is undefined')
      return res.status(404).send({ code: 404, msg: 'Not found' })
    }
    const rent = await db.payRent(rentId)
    return res.status(200).send({ paymentInfo: rent })
  } catch (err) {
    // logger.error('Error while paying rent')
    // logger.error(err.message)
    // logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'There was an error while performing the request, try again' })
  }
})
app.post('/available', authenticateAccessToken, async (req, res) => {
  try {
    const { start, end, productCode } = req.body
    if (!start || !end || !productCode) {
      // logger.error('Missing date or product code')
      return res.status(404).send({ code: 404, msg: 'Missing date' })
    }
    const available = await db.checkAvailability(start, end, productCode)
    if (available) {
      return res.status(200).send({ available })
    }
    return res.status(409).send({ code: 409, msg: 'Selected period is not available' })
  } catch (err) {
    // logger.error(err.message)
    // logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'There was an error while performing the request, try again' })
  }
})
app.get('/find/date/start', async (req, res) => {
  try {
    const { date } = req.body
    if (!date) {
      // logger.error('Missing date')
      return res.status(404).send({ code: 404, msg: 'Missing date' })
    }
    const rent = await db.findStarts(date)
    if (rent.length === 0) return res.status(404).send({ code: 404, msg: 'Not found' }) // può essere cambiato e restituire solo l'array vuoto
    return res.status(200).send({ rent })
  } catch (err) {
    // logger.error(err.message)
    // logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'There was an error while performing the request, try again' })
  }
})
app.post('/getActiveRentals', (req, res) => {
  const { clientCode, start } = req.body
  if (!clientCode || !start) {
    // logger.error('Missing date or client code')
    return res.status(404).send({ code: 404, msg: 'Missing date' })
  }
  const rentals = db.getUserActiveRentals(start, clientCode)
  return res.status(200).send({ rentals })
})
app.get('/find', async (req, res) => {
  try {
    const { productCode, clientCode } = req.body
    const rent = await db.find(productCode, clientCode)
    if (rent.length === 0) return res.status(404).send({ code: 404, msg: 'Not found' })// può essere cambiato e restituire solo l'array vuoto
    return res.status(200).send({ rent })
  } catch (err) {
    // logger.error(err.message)
    // logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'There was an error while performing the request, try again' })
  }
})

export default app
