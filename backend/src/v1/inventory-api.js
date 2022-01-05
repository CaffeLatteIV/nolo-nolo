import Express from 'express'
import Database from '../database/inventory.js'
import loggerWrapper from '../logger.js'
import { authenticateAccessToken } from './authenticate.js'
// TODO: i FUNZIONARI/MANAGER non possono aggiungere prenotazioni ai clienti(?)
// TODO: rendere impossibile agli altri utenti di aggiungere prenotazioni non proprie
const db = new Database()
const logger = loggerWrapper('Inventory API')
const app = Express.Router()
app.get('/findOne', async (req, res) => {
  const { item } = req.body
  logger.info(`Finding item ${item.title}`)
  const products = await db.findOneAvailable(item.title, item.category, item.id)
  if (products === null) return res.status(404).send({ code: 404, msg: 'Item not available' })
  return res.status(200).send({ products })
})
app.get('/category', async (req, res) => {
  const { item } = req.body
  logger.info(`Finding items of ${item.category} category`)
  const products = await db.findAllCategory(item.category, item.available)
  if (products === null) return res.status(404).send({ code: 404, msg: 'Item not available' })
  return res.status(200).send({ products })
})
app.get('/categories', async (req, res) => {
  logger.info(`Finding all different category names`)
  const categories = await db.listAllCategoryNames()
  if (categories === null) return res.status(404).send({ code: 404, msg: 'No category available' })
  return res.status(200).send({ categories })
})
app.get('/products', async (req, res) => {
  logger.info(`Sending list of all products`)
  const products = await db.findAllAvailable()
  if (products === null) return res.status(404).send({ code: 404, msg: 'No product available' })
  return res.status(200).send({ products })
})
app.post('/product', async (req, res) => {
  try {
    const { item } = req.body
    logger.info(`Adding: ${item.title}`)
    db.addInventory(item)
    return res.status(200).send({ code: 200, msg: 'Added' })
  } catch (err) {
    logger.error(err.message)
    logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'Internal server error' })
  }
})

export default app
