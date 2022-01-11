import express from 'express'
// import { authenticateAccessToken } from '../utils/authenticate.js'
import Operation from '../database/operations.js'

const app = express.Router()
app.get('/bestSellers', async (req, res) => {
  const { n } = req.query
  if (n === undefined) {
    res.status(404).send({ code: 404, msg: 'Invalid query' })
  }
  const operation = new Operation()
  res.send({ bestSellers: await operation.findbestSellers(n) })
})

export default app
