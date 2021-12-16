import Express from 'express'
import jwt from 'jsonwebtoken'
import Employee from '../database/employee.js'
import loggerWrapper from '../logger.js'
import { authenticateToken, authenticateUserRole, authenticateManager, generateHash } from './authenticate.js'

const db = new Employee()
const logger = loggerWrapper('Employee API')
const app = Express.Router()
// TODO: accesso riservato solo a amministratori
app.post('/register', authenticateToken, authenticateUserRole, authenticateManager, async (req, res) => {
  try {
    const { item } = req.body
    logger.info(`Adding: ${item.username}`)
    item.password = await generateHash(item.password)
    const employee = await db.addEmployee(item)
    if (employee === undefined) {
      logger.warn('Employee already registered')
      return res.status(400).send({ code: 400, msg: 'Username already registered' })
    }
    // token per autenticazione
    const token = jwt.sign({ username: item.username, role: item.role }, process.env.ACCESS_TOKEN_SECRET)
    return res.status(200).send({ token })
  } catch (err) {
    logger.error(err.message)
    return res.status(500).send({ code: 500, msg: 'Internal server error' })
  }
})

app.post('/login', async (req, res) => {
  const { item } = req.body

  logger.info(`Finding user ${item.username}`)
  item.password = await generateHash(item.password)
  const employee = await db.findEmployee(item.username, item.password)
  if (employee === null) return res.status(404).send({ code: 404, msg: 'User not registered' })
  const token = jwt.sign({ username: item.username, role: employee.role }, process.env.ACCESS_TOKEN_SECRET)
  return res.status(200).send({ token, employee })
})
app.get('/lookup', async (req, res) => {
  // TODO: alti privilegi
  const { item } = req.body
  logger.info(`Finding user ${item.username}`)
  const employee = await db.lookupEmployee(item.username)
  if (employee === null) return res.status(404).send({ code: 404, msg: 'User not registered' })
  return res.status(200).send({ employee })
})
export default app
