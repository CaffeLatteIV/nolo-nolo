import jwt from 'jsonwebtoken'
import crypto from 'crypto'


function generateAccessToken(email, role) {
  return jwt.sign({ email, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
}
function generateRefreshToken(email, role) {
  return jwt.sign({ email, role }, process.env.REFRESH_TOKEN_SECRET)
}
function authenticateAccessToken(req, res, next) {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  if (token === undefined) return res.status(401).send({ code: 401, msg: 'Unauthorized' })
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(500).send({ code: 500, msg: 'Internal server error' })
    req.role = user.role
    return next()
  })
}
function authenticateUserRole(req, res, next) {
  if (req.role === ('funzionario' || 'manager')) return next()
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
