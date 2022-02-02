import Express from 'express'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
// import loggerWrapper from '../logger.js'
import Database from '../database/inventory.js'
// TODO: i FUNZIONARI/MANAGER non possono aggiungere prenotazioni ai clienti(?)
// TODO: rendere impossibile agli altri utenti di aggiungere prenotazioni non proprie
const db = new Database()
// const logger = loggerWrapper('Inventory API')
const app = Express.Router()

const upload = multer({
  dest: '../images',
})
app.get('/findOne', async (req, res) => {
  const { item } = req.body
  // logger.info(`Finding item ${item.title}`)
  const products = await db.findOneAvailable(item.title, item.category, item.id)
  if (products === null) return res.status(404).send({ code: 404, msg: 'Item not available' })
  return res.status(200).send({ products })
})
app.get('/categories/:category', async (req, res) => {
  const { category } = req.params
  const { available } = req.query
  // logger.info(`Finding items of ${category} category`)
  const products = await db.findAllCategory(category, available)
  if (products === null) return res.status(404).send({ code: 404, msg: 'Item not available' })
  return res.status(200).send({ products })
})
app.get('/categories', async (req, res) => {
  const { unique } = req.query
  // logger.info('Finding all different category names')
  const categories = await db.listAllCategoryNames(unique)
  if (categories === null) return res.status(404).send({ code: 404, msg: 'No category available' })
  return res.status(200).send({ categories })
})
app.get('/products', async (req, res) => {
  // logger.info('Sending list of all products')
  const products = await db.findAllAvailable()
  if (products === null) return res.status(404).send({ code: 404, msg: 'No product available' })
  return res.status(200).send({ products })
})
app.get('/products/:productID', async (req, res) => {
  const { productID } = req.params
  // logger.info(`Sending product ${productID}`)
  const products = await db.findOneAvailable(undefined, undefined, productID)
  if (products === null) return res.status(404).send({ code: 404, msg: 'No product available' })
  return res.status(200).send({ products })
})
app.post('/products/update', async (req, res) => {
  const { product } = req.body
  if (!product) {
    // logger.error('No product received')
    return res.status(404).send({ code: 404, msg: 'Missing product' })
  }
  const products = await db.update(product)
  if (products === null) return res.status(404).send({ code: 404, msg: 'No product available' })
  return res.status(200).send({ products })
})
app.post('/product', async (req, res) => {
  try {
    const { item } = req.body
    // logger.info(`Adding: ${item.title}`)
    db.addInventory(item)
    return res.status(200).send({ code: 200, msg: 'Added' })
  } catch (err) {
    // logger.error(err.message)
    // logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'Internal server error' })
  }
})

app.post('/image/upload', upload.single('file' /* name attribute of <file> element in your form */), (req, res) => {
  const tempPath = req.file.path
  const targetPath = path.join(__dirname, '../images/image.png')

  if (path.extname(req.file.originalname).toLowerCase() === ('.png' || '.jpg')) {
    fs.rename(tempPath, targetPath, (err) => {
      if (err) {
        // logger.error(err.message)
        // logger.error(err.stack)
        res.status(500).contentType('application/json').end({ code: 500, msg: 'Error while uploading image' })
      }

      return res.status(200).contentType('application/json')
        .end({ code: 200, msg: 'ok' })
    })
  } else {
    fs.unlink(tempPath, (err) => {
      if (err) {
        // logger.error(err.message)
        // logger.error(err.stack)
      }

      return res.status(403).contentType('application/json').end({ code: 403, msg: 'Only .png or .jpg files are allowed!' })
    })
  }
})
export default app
