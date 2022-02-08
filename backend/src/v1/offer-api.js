import express from 'express'
import Offer from '../database/offer.js'

const app = express.Router()
app.get('/', async (req, res) => {
  const start = parseInt(req.query.start, 10)
  const end = parseInt(req.query.end, 10)
  if (!start || !end || typeof (start) !== 'number' || typeof (end) !== 'number') {
    return res.status(404).send({ code: 404, msg: 'Invalid query' })
  }
  const db = new Offer()
  const offers = await db.getOffer(start, end) || []
  return res.send({ offers })
})
export default app
