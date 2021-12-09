import Express from 'express'
// import bcrypt from 'bcrypt'
import Employee from '../database/employee.js'
import loggerWrapper from '../logger.js'

const db = new Employee()
const logger = loggerWrapper('Employee API')
const app = Express.Router()
// TODO: accesso riservato solo a amministratori

app.post('/register', async (req, res) => {
  try {
    const { item } = req.body
    logger.info(`Adding: ${item.username}`)
    await db.addEmployee(item)
    return res.status(200).send({ code: 200, msg: 'ok' })
  } catch (err) {
    logger.error(err.message)
    return res.status(500).send({ code: 500, msg: 'Internal server error' })
  }
})

app.get('/login', async (req, res) => {
  const { item } = req.body
  logger.info(`Finding user ${item.username}`)
  await db.connect()
  const employee = await db.findEmployee(item.username, item.password)
  if (employee === null) return res.status(404).send({ code: 404, msg: 'User not registered' })
  return res.status(200).send({ employee })
})
app.get('/lookup', async (req, res) => {
  // TODO: alti privilegi
  const { item } = req.body
  logger.info(`Finding user ${item.username}`)
  await db.connect()
  const employee = await db.lookupEmployee(item.username)
  if (employee === null) return res.status(404).send({ code: 404, msg: 'User not registered' })
  return res.status(200).send({ employee })
})
// async function generateHash(message) {
//   // create hash algorithm
//   const salt = await bcrypt.genSalt(10)
//   const hashHex = await bcrypt.hash(message, salt)

//   return hashHex
// }
export default app
