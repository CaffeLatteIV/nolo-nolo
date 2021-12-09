import Express from 'express'
import loggerWrapper from './logger.js'
import rental from './v1/rental.js'
import inventory from './v1/inventory.js'
import client from './v1/client.js'
import employee from './v1/employee.js'

const logger = loggerWrapper('API')
const app = Express()
const PORT = process.env.PORT || 5001
app.use(Express.json())

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})
// error handling
app.use((req, res, next) => {
  if (req.body === undefined) {
    logger.error('Request body undefined')
    return res.status(404).send({ code: 404, msg: 'request is undefined' })
  }
  if (req.body.item === undefined) {
    logger.error('Request item undefined')
    return res.status(404).send({ code: 404, msg: 'item is undefined' })
  }
  return next()
})

app.use('/api/v1/rentals', rental)
app.use('/api/v1/inventories', inventory)
app.use('/api/v1/clients', client)
app.use('/api/v1/employee', employee)

app.listen(PORT, () => logger.info(`Listening on port ${PORT}`))
