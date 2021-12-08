import Express from 'express'
import Database from '../database/database.js'
import loggerWrapper from '../logger.js'

const logger = loggerWrapper('API')
const db = new Database()
const api = Express.Router()

api.use((req, res, next) => {
  if (req.body === undefined) {
    logger.error('Request body undefined')
    return res.status(404).send({ code: 404, msg: 'request is undefined' })
  }
  if (req.body.item === undefined) {
    logger.error('Request item undefined')
    return res.status(404).send({ code: 404, msg: 'item is undefined' })
  }
  return next()
})
api.post('/inventory', async (req, res) => {
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
api.post('/client', async (req, res) => {
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
api.get('/inventory', async (req, res) => {
  const { item } = req.body
  logger.info(`Finding user ${item.username}`)
  await db.connect()
  const prod = await db.findClient(item.username)
  if (prod === null) return res.status(404).send({ code: 404, msg: 'Client not found' })
  return res.status(200).send(prod)
})
api.get('/client', async (req, res) => {
  const { item } = req.body
  logger.info(`Finding user ${item.username}`)
  await db.connect()
  const user = await db.findClient(item.username)
  if (user === null) return res.status(404).send({ code: 404, msg: 'Client not found' })
  return res.status(200).send(user)
})
export default api
