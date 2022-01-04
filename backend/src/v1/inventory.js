import Express from 'express'
import multer from 'multer'
import path from 'path'
import Database from '../database/inventory.js'
import loggerWrapper from '../logger.js'
import { authenticateAccessToken } from './authenticate.js'
// TODO: i FUNZIONARI/MANAGER non possono aggiungere prenotazioni ai clienti(?)
// TODO: rendere impossibile agli altri utenti di aggiungere prenotazioni non proprie
const db = new Database()
const logger = loggerWrapper('Inventory API')
const app = Express.Router()
const imageUpload = multer({ dest: 'uploads/' })
app.get('/findOne', authenticateAccessToken, async (req, res) => {
  const { item } = req.body
  logger.info(`Finding item ${item.title}`)
  const products = await db.findOneAvailable(item.title, item.category, item.id)
  if (products === null) return res.status(404).send({ code: 404, msg: 'Item not available' })
  return res.status(200).send({ products })
})
app.get('/category', authenticateAccessToken, async (req, res) => {
  const { item } = req.body
  logger.info(`Finding items of ${item.category} category`)
  const products = await db.findAllCategory(item.category, item.available)
  if (products === null) return res.status(404).send({ code: 404, msg: 'Item not available' })
  return res.status(200).send({ products })
})
app.get('/products', authenticateAccessToken, async (req, res) => {
  const { item } = req.body
  logger.info(`Finding ${item.title}`)
  const products = await db.findAllTitle(item.title, item.available)
  if (products === null) return res.status(404).send({ code: 404, msg: 'Item not available' })
  return res.status(200).send({ products })
})
app.post('/product', authenticateAccessToken, imageUpload.single('image'), async (req, res) => {
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
app.get('/image/:filename', (req, res) => {
  const { filename } = req.params
  const dirname = path.resolve()
  const fullfilepath = path.join(dirname, `src/images/${filename}`)
  return res.sendFile(fullfilepath)
})
export default app
