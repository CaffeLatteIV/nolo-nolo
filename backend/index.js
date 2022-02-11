/* eslint-disable no-underscore-dangle */
import Express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import './config.js'
import path from 'path'
// import history from 'connect-history-api-fallback'
import loggerWrapper from './src/logger.js'
import rental from './src/v1/rental-api.js'
import inventory from './src/v1/inventory-api.js'
import client from './src/v1/client-api.js'
import employee from './src/v1/employee-api.js'
import token from './src/v1/token-api.js'
import image from './src/v1/image-api.js'
import operation from './src/v1/operation-api.js'
import offers from './src/v1/offer-api.js'
import coupon from './src/v1/coupon-api.js'
import maintenance from './src/v1/maintenance-api.js'

const logger = loggerWrapper('API')
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

const mongoCredentials = {
  user: 'site202156',
  pwd: 'eike4AiN',
  site: 'mongo_site202156',
}
const URL = `mongodb://${mongoCredentials.user}:${mongoCredentials.pwd}@${mongoCredentials.site}?writeConcern=majority`
mongoose.connect(URL, { useNewUrlParser: true })
mongoose.connection.on('error', (err) => logger.error(err))
mongoose.connection.once('open', () => {
  // mongoose.connection.useDb('nolo')
  populate()
  logger.info('connected to mongo')
})
// ------- API ------
app.enable('trust proxy')
app.use('/v1/rentals', rental)
app.use('/v1/inventories', inventory)
app.use('/v1/clients', client)
app.use('/v1/employee', employee)
app.use('/v1/image', image)
app.use('/v1/operations', operation)
app.use('/v1/token', token)
app.use('/v1/offers', offers)
app.use('/v1/coupons', coupon)
app.use('v1/maintenance', maintenance)
// ------- FINE API ------

// ------- DAHSBOARD ------
app.use(Express.static(path.join(global.rootDir, 'dashboard')))
app.get('/dashboard/index.html', (req, res) => res.sendFile(path.join(global.rootDir, 'dashboard', 'HTML', 'index.html')))
app.get('/dashboard/clientStats.html', (req, res) => res.sendFile(path.join(global.rootDir, 'dashboard', 'HTML', 'clientStats.html')))

// ------- FORNTOFFICE ------
app.use(Express.static(path.join(global.rootDir, 'frontoffice')))
app.get('/*', (req, res) => res.sendFile(path.join(global.rootDir, 'frontoffice', 'index.html')))

app.listen(PORT, () => { logger.info(`Listening on port ${PORT}`) })
