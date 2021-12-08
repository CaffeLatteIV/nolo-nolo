import Express from 'express'
import Database from '../database/database.js'
import loggerWrapper from '../logger.js'

const logger = loggerWrapper('API')
const db = new Database()
const api = Express.Router()

api.post('/inventory', async (req, res) => {
  try {
    if (req.body === undefined) res.status(404).send({ code: 404, msg: 'item is undefined' })
    const { item } = req.body
    if (item === undefined) res.status(404).send({ code: 404, msg: 'item is undefined' })
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
    if (req.body === undefined) res.status(404).send({ code: 404, msg: 'item is undefined' })
    const { item } = req.body
    if (item === undefined) res.status(404).send({ code: 404, msg: 'item is undefined' })
    logger.info(`Adding: ${item.title}`)
    await db.connect()
    db.addInventory(item)
    return res.status(200).send({ code: 200, msg: 'ok' })
  } catch (err) {
    logger.error(err.message)
    return res.status(500).send({ code: 500, msg: 'Internal server error' })
  }
})
export default api
