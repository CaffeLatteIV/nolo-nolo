import Express from 'express'
import Employee from '../database/employee.js'
import RefreshToken from '../database/refreshToken.js'
import { employeeSchema } from '../database/schema.js'
import loggerWrapper from '../logger.js'
import { authenticateAccessToken, generateAccessToken, authenticateUserRole, authenticateManager, generateHash, generateRefreshToken } from '../utils/authenticate.js'

const db = new Employee()
const tokenDB = new RefreshToken()
const logger = loggerWrapper('Employee API')
const app = Express.Router()

app.post('/login', async (req, res) => {
  const { email } = req.body
  let { password } = req.body
  logger.info(`Finding employee ${email}`)
  password = await generateHash(password) // encrypt password
  const employee = await db.login(email, password)
  if (employee === null) return res.status(404).send({ code: 404, msg: 'User not registered' })
  logger.info('Found')
  const accessToken = generateAccessToken(email, employee.role)
  const refreshToken = generateRefreshToken(email, employee.role)
  await tokenDB.addRefreshToken(refreshToken)
  return res.status(200).send({ accessToken, refreshToken, client: employee }) // per comodità
})
app.delete('/logout', authenticateAccessToken, authenticateUserRole, async (req, res) => {
  const { refreshToken } = req.body
  logger.info('Logging out user')
  if (refreshToken === undefined) {
    logger.warn('Mssing refresh token to destroy')
    return res.status(400).send({ code: 400, msg: 'Mssing refresh token' })
  }
  const tokenDeleted = await tokenDB.deleteToken(refreshToken)
  if (tokenDeleted === undefined) {
    logger.warn('Invalid refresh token')
    return res.status(400).send({ code: 400, msg: 'Invalid refresh token' })
  }
  logger.info('logged out')
  return res.status(204).send({ code: 204, msg: 'Logged out' })
})
app.post('/register', async (req, res) => {
  try {
    const { email, role } = req.body
    let { password } = req.body
    logger.info(`Adding: {${email}}, role: {${role}}`)
    password = await generateHash(password) // encrypt password
    const employee = await db.addEmployee(email, password, role)
    if (employee === undefined) {
      logger.warn('Employee already registered')
      return res.status(400).send({ code: 400, msg: 'email already registered' })
    }
    // token per autenticazione
    const accessToken = generateAccessToken(email, role)
    const refreshToken = generateRefreshToken(email, role)
    await tokenDB.addRefreshToken(refreshToken)
    logger.info('Employee registered')
    return res.status(200).send({ accessToken, refreshToken })
  } catch (err) {
    logger.error(err.message)
    return res.status(500).send({ code: 500, msg: 'Internal server error' })
  }
})

app.get('/lookup', authenticateAccessToken, authenticateManager, async (req, res) => {
  // TODO: alti privilegi
  const { email } = req.body
  logger.info(`Finding user ${email}`)
  const employee = await db.lookupEmployee(email)
  if (employee === null) return res.status(404).send({ code: 404, msg: 'User not registered' })
  return res.status(200).send({ employee })
})
export default app
