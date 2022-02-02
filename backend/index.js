import Express from 'express'
// import cors from 'cors'
// import path from 'path'
// import loggerWrapper from './src/logger.js'
// import rental from './src/v1/rental-api.js'
// import inventory from './src/v1/inventory-api.js'
// import client from './src/v1/client-api.js'
// import employee from './src/v1/employee-api.js'
// import token from './src/v1/token-api.js'
// import image from './src/v1/image-api.js'
// import operation from './src/v1/operation-api.js'
// import offers from './src/v1/offer-api.js'
global.rootDir = __dirname
// const logger = loggerWrapper('API')
const app = Express()
const PORT = 8000

// const corsOptions = {
//   origin: '*',
//   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
// }
// // app.use(cors(corsOptions))
// app.use(Express.json())

// app.use('/v1/rentals', rental)
// app.use('/v1/inventories', inventory)
// app.use('/v1/clients', client)
// app.use('/v1/employee', employee)
// app.use('/v1/image', image)
// app.use('/v1/operations', operation)
// app.use('/v1/token', token)
// app.use('/v1/offers', offers)
// app.use(Express.static(path.join(global.rootDir, 'frontoffice')))
// app.get('/site/', (req, res) => res.sendFile(path.join(global.rootDir, 'frontoffice', 'index.html')))
app.get('/', (req, res) => res.send('woooo'))
app.listen(PORT, () => {
  // logger.info(`Listening on port ${PORT}`)
  console.log(PORT)
})
