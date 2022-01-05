import Express from 'express'
import Employee from '../database/employee.js'
import RefreshToken from '../database/refreshToken.js'
import loggerWrapper from '../logger.js'
import { authenticateAccessToken, generateAccessToken, authenticateUserRole, authenticateManager, generateHash, generateRefreshToken } from './authenticate.js'

const db = new Employee()
const tokenDB = new RefreshToken()
const logger = loggerWrapper('Employee API')
const app = Express.Router()

app.post('/login', async (req, res) => {
  const { item } = req.body

  logger.info(`Finding employee ${item.email}`)
  item.password = await generateHash(item.password) // encrypt password
  const employee = await db.findEmployee(item.email, item.password)
  if (employee === null) return res.status(404).send({ code: 404, msg: 'User not registered' })
  logger.info('Found')
  const accessToken = generateAccessToken(item.email, employee.role)
  const refreshToken = generateRefreshToken(item.email, employee.role)
  await tokenDB.addRefreshToken(refreshToken)
  return res.status(200).send({ accessToken, refreshToken, employee })
})
app.delete('/logout', authenticateAccessToken, authenticateUserRole, async (req, res) => {
  const { item } = req.body
  logger.info('Logging out user')
  if (item.refreshToken === undefined) {
    logger.warn('Mssing refresh token to destroy')
    return res.status(400).send({ code: 400, msg: 'Mssing refresh token' })
  }
  const tokenDeleted = await tokenDB.deleteToken(item.refreshToken)
  console.log(tokenDeleted)
  if (tokenDeleted === undefined) {
    logger.warn('Invalid refresh token')
    return res.status(400).send({ code: 400, msg: 'Invalid refresh token' })
  }
  logger.info('logged out')
  return res.status(204).send({ code: 204, msg: 'Logged out' })
})
app.post('/register', authenticateAccessToken, authenticateManager, async (req, res) => {
  try {
    const { item } = req.body
    logger.info(`Adding: {${item.email}}, role: {${item.role}}`)
    item.password = await generateHash(item.password) // encrypt password
    const employee = await db.addEmployee(item)
    if (employee === undefined) {
      logger.warn('Employee already registered')
      return res.status(400).send({ code: 400, msg: 'email already registered' })
    }
    logger.info('Employee registered')
    // token per autenticazione
    const accessToken = generateAccessToken(item.email, item.role)
    const refreshToken = generateRefreshToken(item.email, item.role)
    await tokenDB.addRefreshToken(refreshToken)
    return res.status(200).send({ accessToken, refreshToken })
  } catch (err) {
    logger.error(err.message)
    return res.status(500).send({ code: 500, msg: 'Internal server error' })
  }
})

app.get('/lookup', authenticateAccessToken, authenticateManager, async (req, res) => {
  // TODO: alti privilegi
  const { item } = req.body
  logger.info(`Finding user ${item.email}`)
  const employee = await db.lookupEmployee(item.email)
  if (employee === null) return res.status(404).send({ code: 404, msg: 'User not registered' })
  return res.status(200).send({ employee })
})
export default app
