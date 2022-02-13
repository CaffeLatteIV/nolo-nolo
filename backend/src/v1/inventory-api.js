/* eslint-disable no-underscore-dangle */
import Express from 'express'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import loggerWrapper from '../logger.js'
import Database from '../database/inventory.js'
import { authenticateAccessToken, authenticateUserRole } from '../utils/authenticate.js'

const productsFullPath = path.join(global.rootDir, 'src/images')
const db = new Database()
const logger = loggerWrapper('Inventory API')
const app = Express.Router()

const upload = multer({
  dest: productsFullPath,
})
app.get('/categories/:category', async (req, res) => {
  const { category } = req.params
  logger.info(`Finding items of ${category} category`)
  const products = await db.findAllCategory(category)
  if (products === null) return res.status(404).send({ code: 404, msg: 'Item not available' })
  return res.status(200).send({ products })
})
app.get('/categories', async (req, res) => {
  const { unique } = req.query
  const categories = await db.listAllCategoryNames(unique)
  if (categories === null) return res.status(404).send({ code: 404, msg: 'No category available' })
  return res.status(200).send({ categories })
})
app.get('/products', async (req, res) => {
  logger.info('Sending list of all products')
  const products = await db.findAll()
  if (products === null) return res.status(404).send({ code: 404, msg: 'No product available' })
  return res.status(200).send({ products })
})
app.get('/products/:productID', async (req, res) => {
  const { productID } = req.params
  const products = await db.findOne(productID)
  logger.info(`Sending product ${productID}`)
  return res.status(200).send({ products })
})
app.post('/products/update', async (req, res) => {
  const { product } = req.body
  if (!product) {
    logger.error('No product received')
    return res.status(404).send({ code: 404, msg: 'Missing product' })
  }
  const products = await db.update(product)
  if (products === null) return res.status(404).send({ code: 404, msg: 'No product available' })
  return res.status(200).send({ products })
})
app.post('/add', authenticateAccessToken, authenticateUserRole, async (req, res) => {
  try {
    const { item } = req.body
    if (!item) {
      return res.status(404).send({ msg: 'Product is invalid', code: 404 })
    }
    logger.info(`Adding: ${item.title}`)
    await db.addInventory(item)
    return res.status(200).send({ code: 200, msg: 'Added' })
  } catch (err) {
    logger.error(err.message)
    logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'Internal server error' })
  }
})

app.post('/image/upload', upload.single('file'), (req, res) => {
  try {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const extName = path.extname(req.file.originalname).toLowerCase()
    const tempPath = req.file.path
    const filename = path.basename(tempPath)
    const targetPath = path.join(__dirname, `../images/${filename}${extName}`)
    if (extName === '.png' || extName === '.jpg') {
      fs.renameSync(tempPath, targetPath)
      return res.status(200).send({ img: `http://localhost:5000/v1/image/${filename}${extName}` })
    }
    fs.unlinkSync(tempPath)
    return res.status(403).send({ code: 403, msg: 'Only .png or .jpg files are allowed!' })
  } catch (err) {
    logger.error(err.message)
    logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'Error while uploading image' })
  }
})
app.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params
    if (!id) {
      logger.warn('Received a request to delete a product but id is missing')
      return res.status(404).send({ code: 404, msg: 'ID is undefined' })
    }
    logger.info(`Received a request to delete ${id}`)
    await db.delete(id)
    return res.status(200).send()
  } catch (err) {
    logger.error(err.message)
    logger.error(err.stack)
    return res.status(500).send({ code: 500, msg: 'Internal server error' })
  }
})
export default app
