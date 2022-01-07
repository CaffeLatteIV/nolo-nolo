import Express from 'express'
import Rental from '../database/rental.js'
import loggerWrapper from '../logger.js'
import { authenticateAccessToken } from './authenticate.js'

const logger = loggerWrapper('Rental API')
const db = new Rental()
const app = Express.Router()
app.use(authenticateAccessToken)

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
app.get('/clients/:clientCode', async (req, res) => {
  try {
    const { clientCode } = req.query
    console.log(clientCode)
    const rent = await db.findUserRentals(clientCode)
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
    if (rent.length === 0) return res.status(404).send({ code: 404, msg: 'Not found' }) // può essere cambiato e restituire solo l'array vuoto
    // TODO: verificare che restituisca un oggetto json e non un array e basta
    return res.status(200).send(rent)
  } catch (err) {
    logger.error(err.message)
    logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'There was an error while performing the request, try again' })
  }
})

app.get('/find/date/end', async (req, res) => {
  try {
    const { item } = req.body
    const rent = await db.findEndings(item.date)
    // TODO: verificare che restituisca null e non [null]
    if (rent.length === 0) return res.status(404).send({ code: 404, msg: 'Not found' }) // può essere cambiato e restituire solo l'array vuoto
    // TODO: verificare che restituisca un oggetto json e non un array e basta
    return res.status(200).send({ rent })
  } catch (err) {
    logger.error(err.message)
    logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'There was an error while performing the request, try again' })
  }
})
app.get('/find/date/start', async (req, res) => {
  try {
    const { item } = req.body
    const rent = await db.findStarts(item.date)
    if (rent.length === 0) return res.status(404).send({ code: 404, msg: 'Not found' }) // può essere cambiato e restituire solo l'array vuoto
    return res.status(200).send({ rent })
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
    if (rent.length === 0) return res.status(404).send({ code: 404, msg: 'Not found' })// può essere cambiato e restituire solo l'array vuoto
    return res.status(200).send({ rent })
  } catch (err) {
    logger.error(err.message)
    logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'There was an error while performing the request, try again' })
  }
})

export default app
