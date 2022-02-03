/* eslint-disable no-underscore-dangle */
import Express from 'express'
import cors from 'cors'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
// import history from 'connect-history-api-fallback'
// import loggerWrapper from './src/logger.js'
// import rental from './src/v1/rental-api.js'
// import inventory from './src/v1/inventory-api.js'
// import client from './src/v1/client-api.js'
// import employee from './src/v1/employee-api.js'
// import token from './src/v1/token-api.js'
// import image from './src/v1/image-api.js'
// import operation from './src/v1/operation-api.js'
// import offers from './src/v1/offer-api.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
// const logger = loggerWrapper('API')
const app = Express()
const PORT = 8000

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}
// app.use(
//   history({
//     rewrites: [
//       {
//         from: /management-dashboard(\W|\w)*/,
//         to: '/management-dashboard',
//       },
//       {
//         from: /^\/v1\/.*$/,
//         to(context) {
//           return context.parsedUrl.path
//         },
//       },
//       {
//         from: /\/(\W|\w)*/,
//         to: '/',
//       },
//     ],
//     disableDotRule: false,
//   }),
// )
app.use(cors(corsOptions))
app.use(Express.json())

// app.use('/v1/rentals', rental)
// app.use('/v1/inventories', inventory)
// app.use('/v1/clients', client)
// app.use('/v1/employee', employee)
// app.use('/v1/image', image)
// app.use('/v1/operations', operation)
// app.use('/v1/token', token)
// app.use('/v1/offers', offers)
// app.use(Express.static(path.join(__dirname, 'frontoffice')))

const URL = 'mongodb://site202151:aixaem7T@mongo_site202151?writeConcern=majority'
mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Connected to Mongo!')
})
app.get('/site/', (req, res) => res.sendFile(path.join(__dirname, 'frontoffice', 'index.html')))
app.listen(PORT, () => {
  // logger.info(`Listening on port ${PORT}`)
})
