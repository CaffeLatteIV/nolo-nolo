import jwt from 'jsonwebtoken'
import crypto from 'crypto'

function authenticateToken(req, res, next) {
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
export { authenticateToken, authenticateUserRole, authenticateManager, generateHash }
