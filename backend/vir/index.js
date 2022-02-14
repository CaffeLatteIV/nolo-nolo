/* eslint-disable no-undef */
/*
File: index.js
Author: Fabio Vitali
Version: 1.0
Last change on: 10 April 2021

Copyright (c) 2021 by Fabio Vitali

   Permission to use, copy, modify, and/or distribute this software for any
   purpose with or without fee is hereby granted, provided that the above
   copyright notice and this permission notice appear in all copies.

   THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
   SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
   OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
   CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

*/

/* ========================== */
/*                            */
/*           SETUP            */
/*                            */
/* ========================== */
global.rootDir = __dirname
global.startDate = null

const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

// Serve per le variabili di ambiente
require('dotenv').config({ path: path.resolve(`${global.rootDir}/.env`) })

global.publicDir = global.rootDir + process.env.PUBLIC_DIR_URL
global.backendDir = global.rootDir + process.env.BACKEND_DIR_URL
global.frontendDir = global.rootDir + process.env.FRONTEND_DIR_URL
global.imageDir = `${global.backendDir}/image`

global.productImageDirRelative = '/image/product'
global.profileImageDirRelative = '/image/profile'
global.productImageDir = global.backendDir + global.productImageDirRelative
global.profileImageDir = global.backendDir + global.profileImageDirRelative
global.productImagePlaceholderName = 'placeholder.jpg'
global.profileImagePlaceholderName = 'placeholder.png'

/* ========================== */
/*                            */
/*  EXPRESS CONFIG & ROUTES   */
/*                            */
/* ========================== */

const app = express()

app.use('/js', express.static(`${global.rootDir}/public/js`))
app.use('/css', express.static(`${global.rootDir}/public/css`))
app.use('/data', express.static(`${global.rootDir}/public/data`))
app.use('/docs', express.static(`${global.rootDir}/public/html`))
// app.use('/image', express.static(global.rootDir + '/image'));
app.use(global.productImageDirRelative, express.static(global.productImageDir))
app.use(global.profileImageDirRelative, express.static(global.profileImageDir))

app.use(express.json({ limit: '50mb' })) // L'ordine di questi è importante!
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cors())

// Gestione loggin delle richieste al server
const logginFilePath = path.join(global.rootDir, '/log/.log.txt')
const { createFileAndDirSync } = require(`${global.backendDir}/lib/helper`)

// Perchè lo mettiamo sincrono? se non lo fosse dovremmo usare un callback ma renderebbe morgan non funzionante perché andremmo a fare app.use(morgan ...) dopo il resto delle app.use dei vari endpoint
// Se invece usassimo await funzionerebbe però bisognerebbe richiundere tutto index in una funzione async. Facendo ciò però i test partono prima che sia caricato tutto e non vanno.
// Questa è quindi la soluzione più semplice, anche perché non causa grossi problemi avere una funzionalità sincrona chiamata solo durante il setup iniziale del server.

try {
  fs.unlinkSync(logginFilePath)
} catch (err) {
  console.error(err)
}

createFileAndDirSync(logginFilePath)
const accessLogStream = fs.createWriteStream(logginFilePath, { flags: 'a' })
const morgan = require('morgan')

app.use(
  morgan(
    '[:date[web]] :method - :url :req[header] - :status',
    { stream: accessLogStream },
  ),
)

// https://stackoverflow.com/questions/40459511/in-express-js-req-protocol-is-not-picking-up-https-for-my-secure-link-it-alwa
app.enable('trust proxy')

// Format console.log
require('console-stamp')(console, '[HH:MM:ss.l]')

// va usato perché sennò nel frontend non si può accedere all'header Authorization
app.use((req, res, next) => {
  res.set({ 'Access-Control-Expose-Headers': 'Authorization' })
  next()
})

// const objectsRouter = require(global.rootDir + '/public/routers/');

/* ========================== */
/*                            */
/*           MONGODB          */
/*                            */
/* ========================== */

const mongoCredentials = {
  user: process.env.DATABASE_USER,		// "site202120",
  pwd: process.env.DATABASE_PASSWORD,	// "quazio8U",
  site: 'mongo_site202120',
}

const mongooseOptions = {
  useNewUrlParser: true,
}
let mongouri = `mongodb://${mongoCredentials.user}:${mongoCredentials.pwd}@${process.env.DATABASE_URL}?writeConcern=majority`

if (process.env.DEVELOPMENT && process.env.DEVELOPMENT === 'TRUE') {
  mongooseOptions.dbName = 'databaseProgettoTechWeb'
  mongouri = `mongodb://${mongoCredentials.user}:${mongoCredentials.pwd}@${process.env.DATABASE_URL}/${mongooseOptions.dbName}?writeConcern=majority`
}

// mongodb://matteo:vannucchi@localhost/databaseProgettoTechWeb

mongoose.connect(mongouri, mongooseOptions)
mongoose.connection.on('error', (err) => console.log(err))
mongoose.connection.once('open', () => console.log('Connesso al database'))

/* ========================== */
/*                            */
/*           ROUTERS          */
/*                            */
/* ========================== */

app.patch((req, res, next) => {
  if (req.body) {
    req.body.__v = undefined
  }

  next()
})

const authentication = require(`${global.backendDir}/routers/authenticationRouter`)
app.use('/api/authentication/', authentication.router)

const customerRouter = require(`${global.backendDir}/routers/customerRouter`)
app.use('/api/customers/', customerRouter)

const productRouter = require(`${global.backendDir}/routers/productRouter`)
app.use('/api/products/', productRouter)

const employeeRouter = require(`${global.backendDir}/routers/employeeRouter`)
app.use('/api/employees/', employeeRouter)

const rentalRouter = require(`${global.backendDir}/routers/rentalRouter`)
app.use('/api/rentals/', rentalRouter)

const billRouter = require(`${global.backendDir}/routers/billRouter`)
app.use('/api/bills/', billRouter)

const unitRouter = require(`${global.backendDir}/routers/unitRouter`)
app.use('/api/units/', unitRouter)

const offerRouter = require(`${global.backendDir}/routers/offerRouter`)
app.use('/api/offers/', offerRouter)

const pageRouter = require(`${global.backendDir}/routers/pageRouter`)
app.use('/', pageRouter)

const debugRouter = require(`${global.backendDir}/routers/debugRouter`)(mongoose)
app.use('/api/debug/', debugRouter)

const next = require('next')

const nextDirectory = `${global.frontendDir}/frontoffice/`
const nextApp = next({ dir: nextDirectory })
const nextHandler = nextApp.getRequestHandler()

app.get('*', (req, res) => {
  try {
    return nextHandler(req, res)
  } catch (err) {
    return res.status(404).send('Not found')
  }
})

/* ========================== */
/*                            */
/*    ACTIVATE NODE SERVER    */
/*                            */
/* ========================== */

app.listen(8000, () => {
  global.startDate = new Date()
  console.log(`App listening on port 8000 started ${global.startDate.toLocaleString()}`)
})

module.exports = app
