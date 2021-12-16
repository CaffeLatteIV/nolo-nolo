import Express from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { authenticateToken, authenticateUserRole, generateHash } from './authenticate.js'
import Client from '../database/client.js'
import loggerWrapper from '../logger.js'

dotenv.config()
const db = new Client()
const logger = loggerWrapper('Client API')
const app = Express.Router()


app.post('/register', async (req, res) => {
  try {
    const { item } = req.body
    logger.info(`Adding: ${item.username}`)
    item.password = await generateHash(item.password) // encrypt password
    const client = await db.addClients(item) // controllo già nella funzione se esiste un utente
    if (client === undefined) {
      logger.warn('User already registered')
      return res.status(400).send({ code: 400, msg: 'Client already registered' })
    }
    logger.info('Added')
    const token = jwt.sign({ username: item.username, role: undefined }, process.env.ACCESS_TOKEN_SECRET)

    return res.status(200).send({ token })
  } catch (err) {
    logger.error(err.message)
    return res.status(500).send({ code: 500, msg: 'Internal server error' })
  }
})

app.post('/login', async (req, res) => {
  const { item } = req.body
  logger.info(`Finding user ${item.username}`)
  const password = await generateHash(item.password)
  const user = await db.findClient(item.username, password)
  if (user === null) return res.status(404).send({ code: 404, msg: 'User not found' })
  const token = jwt.sign({ username: item.username, role: undefined }, process.env.ACCESS_TOKEN_SECRET)
  return res.status(200).send({ token, user })
})
app.get('/lookup', authenticateToken, authenticateUserRole, async (req, res) => {
  // TODO: accesso riservato solo a amministratori
  const { item } = req.body
  logger.info(`Finding user ${item.username}`)
  const user = await db.lookupClient(item.username)
  if (user === null) return res.status(404).send({ code: 404, msg: 'User not found' })
  return res.status(200).send({ user })
})

export default app
