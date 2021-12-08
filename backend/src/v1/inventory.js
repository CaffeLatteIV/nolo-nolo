import Express from 'express'
import Database from '../database/database.js'
import loggerWrapper from '../logger.js'

const db = new Database()
const logger = loggerWrapper('Inventory API')
const app = Express.Router()

app.get('/inventory', async (req, res) => {
  const { item } = req.body
  logger.info(`Finding item ${item.title}`)
  await db.connect()
  const prod = await db.findInventory(item.title)
  if (prod === null) return res.status(404).send({ code: 404, msg: 'Item not available' })
  return res.status(200).send(prod)
})
app.post('/inventory', async (req, res) => {
  try {
    const { item } = req.body
    logger.info(`Adding: ${item.title}`)
    await db.connect()
    db.addInventory(item)
    return res.status(200).send({ code: 200, msg: 'ok' })
  } catch (err) {
    logger.error(err.message)
    return res.status(500).send({ code: 500, msg: 'Internal server error' })
  }
})

export default app
