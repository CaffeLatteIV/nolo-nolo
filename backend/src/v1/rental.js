import Express from 'express'
import Database from '../database/database.js'
import loggerWrapper from '../logger.js'

const logger = loggerWrapper('API')
const db = new Database()
const app = Express.Router()

app.post('/rental', async (req, res) => {
  try {
    const { item } = req.body
    await db.addRentals(item)
    return res.status(200).send({ code: 200, msg: 'Rent added' })
  } catch (err) {
    logger.error(err.message)
    logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'There was an error while uploading data, try again' })
  }
})
app.get('/rental', async (req, res) => {
  try {
    const { item } = req.body
    const rent = await db.findRentals(item)
    if (rent) return res.status(200).send(rent)
    return res.status(404).send({ code: 400, msg: 'Not found' })
  } catch (err) {
    logger.error(err.message)
    logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'There was an error while performing the request, try again' })
  }
})
export default app
