import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import dotenv from 'dotenv'
import path from 'path'
import loggerWrapper from '../logger.js'

dotenv.config({ path: path.resolve(`${global.rootDir}/.env`) })

const logger = loggerWrapper('Authenticate')
function generateAccessToken(email, role) {
  return jwt.sign({ email, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
}
function generateRefreshToken(email, role) {
  return jwt.sign({ email, role }, process.env.REFRESH_TOKEN_SECRET)
}
// eslint-disable-next-line consistent-return
function authenticateAccessToken(req, res, next) {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  if (token === undefined) return res.status(401).send({ code: 401, msg: 'Unauthorized' })
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      logger.error(err.message)
      logger.error(err.stack)
      return res.send({ code: 401, msg: 'Unauthorized' })
    }
    req.role = user.role
    return next()
  })
}
function authenticateUserRole(req, res, next) {
  if (req.role === 'funzionario' || req.role === 'manager') return next()
  return res.status(401).send({ code: 401, msg: 'Unauthorized' })
}
function authenticateManager(req, res, next) {
  if (req.role === 'manager') return next()
  return res.status(401).send({ code: 401, msg: 'Unauthorized' })
}
// create hash algorithm
async function generateHash(message) {
  return crypto.createHash('sha256').update(message).digest('hex')
}
export { authenticateAccessToken, generateAccessToken, generateRefreshToken, authenticateUserRole, authenticateManager, generateHash }
