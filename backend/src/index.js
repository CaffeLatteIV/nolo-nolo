import Express from 'express'
import loggerWrapper from './logger.js'
import rental from './v1/rental-api.js'
import inventory from './v1/inventory-api.js'
import client from './v1/client-api.js'
import employee from './v1/employee-api.js'
import token from './v1/token-api.js'
import image from './v1/image-api.js'

const logger = loggerWrapper('API')
const app = Express()
const PORT = process.env.PORT || 5000
app.use(Express.json())

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  return next()
})

app.use('/v1', token)
app.use('/v1/rentals', rental)
app.use('/v1/inventories', inventory)
app.use('/v1/clients', client)
app.use('/v1/employee', employee)
app.use('/v1/image', image)

app.listen(PORT, () => logger.info(`Listening on port ${PORT}`))
