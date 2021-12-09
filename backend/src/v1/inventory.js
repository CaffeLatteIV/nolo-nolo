import Express from 'express'
import Database from '../database/inventory'
import loggerWrapper from '../logger'

const db = new Database()
const logger = loggerWrapper('Inventory API')
const app = Express.Router()

app.get('/findOne', async (req, res) => {
  const { item } = req.body
  logger.info(`Finding item ${item.title}`)
  const prod = await db.findOneAvailable(item.title, item.category, item.id)
  if (prod === null) return res.status(404).send({ code: 404, msg: 'Item not available' })
  return res.status(200).send(prod)
})
app.get('/category', async (req, res) => {
  const { item } = req.body
  logger.info(`Finding items of ${item.category} category`)
  const prod = await db.findAll(item.category, item.available)
  if (prod === null) return res.status(404).send({ code: 404, msg: 'Item not available' })
  return res.status(200).send(prod)
})
app.post('/product', async (req, res) => {
  try {
    const { item } = req.body
    logger.info(`Adding: ${item.title}`)
    await db.connect()
    db.addInventory(item)
    return res.status(200).send({ code: 200, msg: 'ok' })
  } catch (err) {
    logger.error(err.message)
    logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'Internal server error' })
  }
})

export default app
