import Express from 'express'
import loggerWrapper from './logger.js'
import api from './v1/api.js'

const logger = loggerWrapper('API')
const app = Express()
const PORT = process.env.PORT || 5001
app.get('/', (req, res) => res.send('wooo'))
app.use('/api/v1', api)

app.listen(PORT, () => logger.info(`Listening on port ${PORT}`))
