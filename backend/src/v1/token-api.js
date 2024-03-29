/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken'
// import dotenv from 'dotenv'
import express from 'express'
import loggerWrapper from '../logger.js'
import { generateAccessToken } from '../utils/authenticate.js'
import RefreshToken from '../database/refreshToken.js'

// dotenv.config()
const logger = loggerWrapper('TOKEN')
const db = new RefreshToken()
const app = express.Router()
app.post('/validate', (req, res) => {
  const { accessToken } = req.body
  if (!accessToken) {
    logger.error('Received a request to verify the access token but the access token is missing')
    return res.status(404).send({ code: 404, msg: 'Refresh token is missing' })
  }
  logger.info('Checking if the access token is still valid')
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err) => {
    if (err) {
      logger.info('Access token is no longer valid')
      return res.send({ code: 401, msg: 'Unauthorized' })
    }
    logger.info('Access token is valid')
    return res.status(200).send({ code: 200, msg: 'valid' })
  })
})
app.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) {
    logger.error('Refresh token is missing')
    return res.status(404).send({ code: 404, msg: 'Refresh token is missing' })
  }
  let accessToken = ''
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, item) => {
    if (err) {
      logger.error(err.message)
      logger.error(err.stack)
      return res.status(403).send({ code: 403, msg: 'Error' })
    }
    accessToken = generateAccessToken(item.email, item.role)
    logger.info('Sending new access token')
    return res.status(200).send({ accessToken })
  })
})
app.delete('/remove', (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) {
    logger.error('Refresh token is missing')
    return res.status(401).send({ code: 404, msg: 'Refresh token is missing' })
  }
  try {
    db.deleteToken(refreshToken)
    return res.status(200).send({ code: 200, msg: 'Deleted' })
  } catch (err) {
    logger.error(err.message)
    logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'Internal server error' })
  }
})

export default app
