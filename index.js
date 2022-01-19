/**
 * @file Entry point
 * @author Mattia Babbini, Alessandro Libralesso
 */

 global.rootDir = __dirname

 // Imports
 import express, { json, static } from 'express'
 import { connection, connect } from 'mongoose'
 import cors from 'cors'
 import customers from './scripts/api/customers'
 import staff from './scripts/api/staff'
 import auth from './scripts/api/authentication'
 import items from './scripts/api/items'
 import products from './scripts/api/products'
 import scripts from './scripts/api/db'
 import rentals from './scripts/api/rentals'
 import notifications from './scripts/api/notifications'
 import invoices from './scripts/api/invoices'
 import reparations from './scripts/api/reparations'
 import history from 'connect-history-api-fallback'
 import { resolve } from 'path'
 
 import dotenv from 'dotenv'
 require('dotenv').config({ path: resolve(global.rootDir + "/.env") });
 
 console.log(process.env.MONGO_URI)
 
 import { startRoutines } from './scripts/routines'

const uri = `mongodb://localhost:202151/NoloNoloPlus`
const PORT = 8000
const db = connection

app = express()
app.use(cors())
app.use(json())

// Define static paths
app.use('/js', static(global.rootDir + '/public/js'))
app.use('/css', static(global.rootDir + '/public/css'))
app.use('/data', static(global.rootDir + '/public/data'))

app.use('/img', static(global.rootDir + '/public/media/img'))
app.use('/admin', static(global.rootDir + '/public/html'))

app.use(
    history({
      rewrites: [
        {
            from: /dashboard(\W|\w)*/,
            to: '/frontend/dashboard',
        },
        {
            from: /^\/api\/.*$/,
            to: function (context) {
                return context.parsedUrl.path
            },
        },
        {
            from: /\/(\W|\w)*/,
            to: '/frontend/frontoffice/',
        },
    ],
    disableDotRule: false,
})
)

// Set APIs route
app.use('/api/customers/', customers)
app.use('/api/staff/', staff)
app.use('/api/auth/', auth)
app.use('/api/items/', items)
app.use('/api/products/', products)
app.use('/api/rentals/', rentals)
app.use('/api/invoices/', invoices)
app.use('/api/reparations/', reparations)
app.use('/api/notifications/', notifications)
app.use('/api/scripts/', scripts)

// Connect the database
connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
    console.log('Connected to Mongo!')
})

startRoutines()

app.get('/management-dashboard', (req, res) => {
    res.sendFile(
        global.rootDir + '/public/html/management-dashboard/index.html'
    )
})
app.get('/', (req, res) => {
    res.sendFile(global.rootDir + '/public/index.html')
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}.`)
})