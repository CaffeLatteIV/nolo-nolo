import express from 'express'
import { authenticateAccessToken, authenticateUserRole } from '../utils/authenticate.js'
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
app.get('/search/:title', async (req, res) => {
  const { title } = req.params
  if (title === undefined) {
    res.status(404).send({ code: 404, msg: 'Invalid query' })
  }
  const operation = new Operation()
  res.send({ result: await operation.findSimilarTitle(title) })
})
app.get('/clients/count/age', authenticateAccessToken, authenticateUserRole, async (req, res) => {
  const operation = new Operation()
  res.send({ result: await operation.groupClientAge() })
})
app.get('/clients/count/gender', authenticateAccessToken, authenticateUserRole, async (req, res) => {
  const operation = new Operation()
  res.send({ result: await operation.countGender() })
})
app.get('/rentals/revenue/month/:title', authenticateAccessToken, authenticateUserRole, async (req, res) => {
  const { title } = req.params
  const operation = new Operation()
  res.send({ result: await operation.getRevenueByMonth(title) })
})
app.get('/rentals/revenue/month/', authenticateAccessToken, authenticateUserRole, async (req, res) => {
  const operation = new Operation()
  res.send({ result: await operation.getRevenueByMonth() })
})
app.get('/rentals/count/status/:title', authenticateAccessToken, authenticateUserRole, async (req, res) => {
  const { title } = req.params
  const operation = new Operation()
  res.send({ result: await operation.countStatus(title) })
})
app.get('/rentals/count/status/', authenticateAccessToken, authenticateUserRole, async (req, res) => {
  const operation = new Operation()
  res.send({ result: await operation.countStatus() })
})
app.get('/rentals/count/conditions/:title', authenticateAccessToken, authenticateUserRole, async (req, res) => {
  const { title } = req.params
  const operation = new Operation()
  res.send({ result: await operation.countConditions(title) })
})
app.get('/rentals/count/conditions/', authenticateAccessToken, authenticateUserRole, async (req, res) => {
  const operation = new Operation()
  res.send({ result: await operation.countConditions() })
})
app.get('/rentals/single/avg/:title', authenticateAccessToken, authenticateUserRole, async (req, res) => {
  const { title } = req.params
  const operation = new Operation()
  res.send({ result: await operation.avgRentLength(title) })
})
app.get('/rentals/single/avg/', authenticateAccessToken, authenticateUserRole, async (req, res) => {
  const operation = new Operation()
  res.send({ result: await operation.avgRentLength() })
})
app.get('/rentals/month/avg/:title', authenticateAccessToken, authenticateUserRole, async (req, res) => {
  const { title } = req.params
  const operation = new Operation()
  res.send({ result: await operation.avgRentByMonth(title) })
})
app.get('/rentals/month/avg/', authenticateAccessToken, authenticateUserRole, async (req, res) => {
  const operation = new Operation()
  res.send({ result: await operation.avgRentByMonth() })
})

export default app
