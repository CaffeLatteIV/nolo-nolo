import express from 'express'
import { authenticateAccessToken, authenticateManager } from '../utils/authenticate.js'
import Operation from '../database/operations.js'

const app = express.Router()
app.get('/bestSellers', async (req, res) => {
  const { n } = req.query
  if (n === undefined) {
    return res.status(404).send({ code: 404, msg: 'Invalid query' })
  }
  const operation = new Operation()
  return res.send({ bestSellers: await operation.findbestSellers(n) })
})
app.get('/search/:title', async (req, res) => {
  const { title } = req.params
  if (title === undefined) {
    return res.status(404).send({ code: 404, msg: 'Invalid query' })
  }
  const operation = new Operation()
  return res.send({ result: await operation.findSimilarTitle(title) })
})
app.get('/clients/count/age', authenticateAccessToken, authenticateManager, async (req, res) => {
  const operation = new Operation()
  return res.send({ result: await operation.groupClientAge() })
})
app.get('/clients/count/gender', authenticateAccessToken, authenticateManager, async (req, res) => {
  const operation = new Operation()
  return res.send({ result: await operation.countGender() })
})
app.get('/rentals/revenue/month/:title', authenticateAccessToken, authenticateManager, async (req, res) => {
  const { title } = req.params
  const operation = new Operation()
  return res.send({ result: await operation.getRevenueByMonth(title) })
})
app.get('/rentals/revenue/month/', authenticateAccessToken, authenticateManager, async (req, res) => {
  const operation = new Operation()
  return res.send({ result: await operation.getRevenueByMonth() })
})
app.get('/rentals/count/status/:title', authenticateAccessToken, authenticateManager, async (req, res) => {
  const { title } = req.params
  const operation = new Operation()
  return res.send({ result: await operation.countStatus(title) })
})
app.get('/rentals/count/status/', authenticateAccessToken, authenticateManager, async (req, res) => {
  const operation = new Operation()
  return res.send({ result: await operation.countStatus() })
})
app.get('/rentals/count/conditions/:title', authenticateAccessToken, authenticateManager, async (req, res) => {
  const { title } = req.params
  const operation = new Operation()
  return res.send({ result: await operation.countConditions(title) })
})
app.get('/rentals/count/conditions/', authenticateAccessToken, authenticateManager, async (req, res) => {
  const operation = new Operation()
  return res.send({ result: await operation.countConditions() })
})
app.get('/rentals/single/avg/:title', authenticateAccessToken, authenticateManager, async (req, res) => {
  const { title } = req.params
  const operation = new Operation()
  return res.send({ result: await operation.avgRentLength(title) })
})
app.get('/rentals/single/avg/', authenticateAccessToken, authenticateManager, async (req, res) => {
  const operation = new Operation()
  return res.send({ result: await operation.avgRentLength() })
})
app.get('/rentals/month/avg/:title', authenticateAccessToken, authenticateManager, async (req, res) => {
  const { title } = req.params
  const operation = new Operation()
  return res.send({ result: await operation.avgRentByMonth(title) })
})
app.get('/rentals/month/avg/', authenticateAccessToken, authenticateManager, async (req, res) => {
  const operation = new Operation()
  return res.send({ result: await operation.avgRentByMonth() })
})

export default app
