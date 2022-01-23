import express from 'express'
import Offer from '../database/offer.js'

const app = express.Router()
app.get('/', async (req, res) => {
  const { start, end } = req.query
  if (!start || !end) {
    return res.status(404).send({ code: 404, msg: 'Invalid query' })
  }
  const db = new Offer()
  const offers = await db.getOffer(start, end)
  return res.send({ offers })
})
export default app
