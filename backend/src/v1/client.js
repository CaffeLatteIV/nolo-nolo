import Express from 'express'
import dotenv from 'dotenv'
import { authenticateAccessToken, generateAccessToken, generateRefreshToken, authenticateUserRole, generateHash } from './authenticate.js'
import Client from '../database/client.js'
import RefreshToken from '../database/refreshToken.js'
import loggerWrapper from '../logger.js'

dotenv.config()
const db = new Client()
const tokenDB = new RefreshToken()
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
    const accessToken = generateAccessToken(item.username, undefined)
    const refreshToken = generateRefreshToken(item.username, undefined)
    await tokenDB.addRefreshToken(refreshToken)
    return res.status(200).send({ accessToken, refreshToken, client })
  } catch (err) {
    logger.error(err.message)
    return res.status(500).send({ code: 500, msg: 'Internal server error' })
  }
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  logger.info(`Finding user ${username}`)
  const encryptedPassword = await generateHash(password)
  const client = await db.findClient(username, encryptedPassword)
  if (client === null) return res.status(404).send({ code: 404, msg: 'client not found' })
  const accessToken = generateAccessToken(username, undefined)
  const refreshToken = generateRefreshToken(username, undefined)
  await tokenDB.addRefreshToken(refreshToken)
  return res.status(200).send({ accessToken, refreshToken, client })
})
app.delete('/logout', authenticateAccessToken, async (req, res) => {
  const { item } = req.body
  logger.info('Logging out user')
  if (item.refreshToken === undefined) {
    logger.warn('Mssing refresh token to destroy')
    res.status(400).send({ code: 400, msg: 'Mssing refresh token' })
  }
  const tokenDeleted = await tokenDB.deleteToken(item.refreshToken)
  if (tokenDeleted === undefined) {
    logger.warn('Invalid refresh token')
    return res.status(400).send({ code: 400, msg: 'Invalid refresh token' })
  }
  logger.info('logged out')
  return res.status(204).send({ code: 204, msg: 'Logged out' })
})
app.get('/lookup', authenticateAccessToken, authenticateUserRole, async (req, res) => {
  const { username } = req.body
  logger.info(`Finding user ${username}`)
  const user = await db.lookupClient(username)
  if (user === null) return res.status(404).send({ code: 404, msg: 'User not found' })
  return res.status(200).send({ user })
})

export default app
