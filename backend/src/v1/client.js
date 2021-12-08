import Express from 'express'
import Database from '../database/database.js'
import loggerWrapper from '../logger.js'

const db = new Database()
const logger = loggerWrapper('Client API')
const app = Express.Router()

app.post('/client', async (req, res) => {
  try {
    const { item } = req.body
    logger.info(`Adding: ${item.username}`)
    await db.connect()
    db.addClients(item)
    return res.status(200).send({ code: 200, msg: 'ok' })
  } catch (err) {
    logger.error(err.message)
    return res.status(500).send({ code: 500, msg: 'Internal server error' })
  }
})

app.get('/client', async (req, res) => {
  const { item } = req.body
  logger.info(`Finding user ${item.username}`)
  await db.connect()
  const user = await db.findClient(item.username)
  if (user === null) return res.status(404).send({ code: 404, msg: 'Client not found' })
  return res.status(200).send(user)
})
export default app
