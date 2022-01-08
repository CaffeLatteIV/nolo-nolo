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
    const { email } = req.body
    let { password } = req.body
    if (!(!!email && !!password)) {
      logger.error('Username or password undefiend')
      return res.status(404).send({ code: 404, msg: 'Username or password undefiend' })
    }
    logger.info(`Adding: ${email}`)
    password = await generateHash(password) // encrypt password
    let client = await db.findClient(email) // controllo già nella funzione se esiste un utente
    if (client !== null) {
      logger.warn('User already registered')
      return res.status(400).send({ code: 400, msg: 'Client already registered' })
    }
    client = await db.addClient(email, password)
    const accessToken = generateAccessToken(email, undefined)
    const refreshToken = generateRefreshToken(email, undefined)
    await tokenDB.addRefreshToken(refreshToken)
    logger.info('Added')
    return res.status(200).send({ accessToken, refreshToken, client })
  } catch (err) {
    logger.error(err.message)
    logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'Internal server error' })
  }
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!(!!email && !!password)) {
    logger.error('Email or password undefiend')
    return res.status(404).send({ code: 404, msg: 'Username or password undefiend' })
  }
  logger.info(`Finding user ${email}`)
  const encryptedPassword = await generateHash(password)
  const client = await db.findClient(email, encryptedPassword)
  if (client === null) return res.status(404).send({ code: 404, msg: 'client not found' })
  const accessToken = generateAccessToken(email, undefined)
  const refreshToken = generateRefreshToken(email, undefined)
  await tokenDB.addRefreshToken(refreshToken)
  logger.info('Found')
  return res.status(200).send({ accessToken, refreshToken, client })
})
app.delete('/logout', authenticateAccessToken, async (req, res) => {
  const { refreshToken } = req.body
  logger.info('Logging out user')
  if (refreshToken === undefined) {
    logger.warn('Mssing refresh token to destroy')
    res.status(400).send({ code: 400, msg: 'Mssing refresh token' })
  }
  const tokenDeleted = await tokenDB.deleteToken(refreshToken)
  if (tokenDeleted === undefined) {
    logger.warn('Invalid refresh token')
    return res.status(400).send({ code: 400, msg: 'Invalid refresh token' })
  }
  logger.info('logged out')
  return res.status(204).send({ code: 204, msg: 'Logged out' })
})
app.get('/lookup', authenticateAccessToken, authenticateUserRole, async (req, res) => {
  const { email } = req.body
  logger.info(`Finding user ${email}`)
  const user = await db.lookupClient(email)
  if (user === null) return res.status(404).send({ code: 404, msg: 'User not found' })
  return res.status(200).send({ user })
})

export default app