import Express from 'express'
import Database from '../database/rental.js'
import loggerWrapper from '../logger.js'

const logger = loggerWrapper('Rental API')
const db = new Database()
const app = Express.Router()

app.post('/add', async (req, res) => {
  try {
    const { item } = req.body
    await db.addRentals(item)
    return res.status(200).send({ code: 200, msg: 'Rental added' })
  } catch (err) {
    logger.error(err.message)
    logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'There was an error while uploading data, try again' })
  }
})
app.get('/find/user', async (req, res) => {
  try {
    const { item } = req.body
    const rent = await db.findUserRentals(item.clientCode)
    // TODO: verificare che restituisca null e non [null]
    if (rent === null) return res.status(404).send({ code: 400, msg: 'Not found' })
    return res.status(200).send(rent)
  } catch (err) {
    logger.error(err.message)
    logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'There was an error while performing the request, try again' })
  }
})
app.get('/find/product', async (req, res) => {
  try {
    const { item } = req.body
    const rent = await db.findProductRentals(item.productCode)
    // TODO: verificare che restituisca null e non [null]
    if (rent === null) return res.status(404).send({ code: 400, msg: 'Not found' })
    // TODO: verificare che restituisca un oggetto json e non un array e basta
    return res.status(200).send(rent)
  } catch (err) {
    logger.error(err.message)
    logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'There was an error while performing the request, try again' })
  }
})

app.get('/find/date', async (req, res) => {
  try {
    const { item } = req.body
    const rent = await db.findRecentEndings(item.date)
    // TODO: verificare che restituisca null e non [null]
    if (rent === null) return res.status(404).send({ code: 400, msg: 'Not found' })
    // TODO: verificare che restituisca un oggetto json e non un array e basta
    return res.status(200).send(rent)
  } catch (err) {
    logger.error(err.message)
    logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'There was an error while performing the request, try again' })
  }
})
app.get('/find', async (req, res) => {
  try {
    const { item } = req.body
    const rent = await db.find(item.productCode, item.clientCode)
    // TODO: verificare che restituisca null e non [null]
    if (rent === null) return res.status(404).send({ code: 400, msg: 'Not found' })
    // TODO: verificare che restituisca un oggetto json e non un array e basta
    return res.status(200).send(rent)
  } catch (err) {
    logger.error(err.message)
    logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'There was an error while performing the request, try again' })
  }
})

export default app
