import Express from 'express'
// import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import Client from '../database/client.js'
import loggerWrapper from '../logger.js'

dotenv.config()
const db = new Client()
const logger = loggerWrapper('Client API')
const app = Express.Router()

async function generateHash(message) {
  // create hash algorithm
  const salt = await bcrypt.genSalt(10)
  const hashHex = await bcrypt.hash(message, salt)

  return hashHex
}
app.post('/register', async (req, res) => {
  try {
    const { item } = req.body
    logger.info(`Adding: ${item.username}`)
    const client = await db.addClients(item)
    if (client === undefined) return res.status(400).send({ code: 400, msg: 'Client already registered' })
    return res.status(200).send({ code: 200, msg: 'Added' })
  } catch (err) {
    logger.error(err.message)
    return res.status(500).send({ code: 500, msg: 'Internal server error' })
  }
})

app.post('/login', async (req, res) => {
  const { item } = req.body
  logger.info(`Finding user ${item.username}`)
  const password = generateHash(item.password)
  const user = await db.findClient(item.username, password)
  if (user === null) return res.status(404).send({ code: 404, msg: 'User not registered' })
  const token = jwt.sign(item.username, process.env.ACCESS_TOKEN_SECRET)
  return res.status(200).send({ token, user })
})
app.get('/lookup', async (req, res) => {
  // TODO: accesso riservato solo a amministratori
  const { item } = req.body
  logger.info(`Finding user ${item.username}`)
  const user = await db.lookupClient(item.username)
  if (user === null) return res.status(404).send({ code: 404, msg: 'User not found' })
  return res.status(200).send({ user })
})

export default app
