import Express from 'express'
import cors from 'cors'
import loggerWrapper from './logger.js'
import rental from './v1/rental-api.js'
import inventory from './v1/inventory-api.js'
import client from './v1/client-api.js'
import employee from './v1/employee-api.js'
import token from './v1/token-api.js'
import image from './v1/image-api.js'
import operation from './v1/operation-api.js'
import offers from './v1/offer-api.js'

const logger = loggerWrapper('API')
const app = Express()
const PORT = process.env.PORT || 5000

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))
app.use(Express.json())

app.use('/v1/rentals', rental)
app.use('/v1/inventories', inventory)
app.use('/v1/clients', client)
app.use('/v1/employee', employee)
app.use('/v1/image', image)
app.use('/v1/operations', operation)
app.use('/v1/token', token)
app.use('/v1/offers', offers)

app.listen(PORT, () => logger.info(`Listening on port ${PORT}`))
