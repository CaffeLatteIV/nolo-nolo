import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import express from 'express'
import loggerWrapper from '../logger.js'
import { generateAccessToken } from './authenticate.js'
import RefreshToken from '../database/refreshToken.js'

dotenv.config()
const logger = loggerWrapper('TOKEN')
const db = new RefreshToken()
const app = express.Router()
app.post('/token', (req, res) => {
  const { refreshToken } = req.body.item
  if (!refreshToken) {
    logger.error('Refresh token is missing')
    return res.status(401).send({ code: 401, msg: 'Refresh token is missing' })
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, item) => {
    if (err) {
      logger.error(err.message)
      logger.error(err.stack)
      return res.status(403).send({ code: 403, msg: 'Error' })
    }
    const accessToken = generateAccessToken(item.username, item.role)

    return res.status(200).send({ accessToken })
  })
})
export default app
