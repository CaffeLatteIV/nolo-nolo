import Express from 'express'
import loggerWrapper from './logger.js'
import api from './v1/api.js'

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
app.use('/api/v1', api)

app.listen(PORT, () => logger.info(`Listening on port ${PORT}`))
