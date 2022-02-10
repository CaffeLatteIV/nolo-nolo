/* eslint-disable no-loop-func */
import mongoose from 'mongoose'
import {
  inventorySchema,
  rentSchema,
  clientSchema,
  employeeSchema,
  offerSchema,
  couponSchema,
} from './schema.js'
import { generateHash } from '../utils/authenticate.js'
import loggerWrapper from '../logger.js'

const logger = loggerWrapper('Populate DB')
function createInventoryList() {
  return [
    {
      available: true,
      price: {
        weekend: 25,
        weekday: 15,
        points: 200,
      },
      condition: 'Ottima',
      category: 'Bici',
      title: 'Esperia Mtb Michigan',
      description:
        'Mountain Bike 26" da ragazzo caratterizzata da telaio in acciaio, forcella ammortizzata acciaio, cambio Shimano TZ500 21V, comandi 7x3V con leve freno integrate, freni v-brake alluminio e cerchi alluminio con coperture 26x1,95.',
    },
    {
      available: true,
      price: {
        weekend: 35,
        weekday: 25,
        points: 350,
      },
      media: {
        img: 'https://site202156.tw.cs.unibo.it/v1/image/cervelo-bici-gravel-aspero-apex-1-seabreeze-blue.jpg',
      },
      condition: 'Ottima',
      category: 'Bici corsa',
      title: 'Cervelo Bici Gravel Aspero',
      description: 'Cervelo Bici Gravel Aspero Apex 1 Seabreeze/Blue ',
      stock: 5,
    },
    {
      available: false,
      price: {
        weekend: 25,
        weekday: 15,
        points: 100,
      },
      condition: 'Buona',
      category: 'Bici',
      title: 'Esperia Mtb Michigan',
      description:
        'Mountain Bike 26" da ragazzo caratterizzata da telaio in acciaio, forcella ammortizzata acciaio, cambio Shimano TZ500 21V, comandi 7x3V con leve freno integrate, freni v-brake alluminio e cerchi alluminio con coperture 26x1,95.',
    },
    {
      available: true,
      price: {
        weekend: 6,
        weekday: 9,
        points: 150,
      },
      media: {
        img: 'https://site202156.tw.cs.unibo.it/v1/image/prismalia-monopattino-elettrico-85-pollici-36v-10a-400-w.jpg',
      },
      condition: 'Ottima',
      category: 'Monopattino',
      title: 'Prismalia Monopattino Elettrico 8.5 pollici',
      description:
        'Uno dei migliori monopattini presenti sul mercato unisce doti di agilità e robustezza, grazie al doppio ammortizzatore posteriore riesce ad affrontare senza problemi superfici disconnesse, il sistema di sgancio anteriore è particolarmente robusto e non assume giochi anche dopo un utilizzo continuo, il monopattino è dotato altre che di un freno posteriore a disco di ben 110 mm anche di uno anteriore kers con recupero di energia è possibile scaricare sul proprio telefonino un App gratuita che oltre ad monitorare tutti i dati del mezzo aggiunge la possibilità di inserire il cruise control e persino bloccare il mezzo con  antifurto.',
    },
    {
      available: true,
      price: {
        weekend: 25,
        weekday: 15,
        points: 170,
      },
      media: {
        img: 'https://site202156.tw.cs.unibo.it/v1/image/ghost-e-riot-trail-cf-advanced-29-12v-brown.jpg',
      },
      condition: 'Ottima',
      category: 'e-Bike',
      title: 'Ghost E-Riot Trail CF Advanced',
      description: "Ghost E-Riot Trail CF Advanced 29'' 12v Brown",
    },
    {
      available: true,
      price: {
        weekend: 30,
        weekday: 20,
        points: 150,
      },
      condition: 'Ottima',
      category: 'Bici Ibrida',
      title: 'Kellys Bici Ibrida Phanatic',
      description: 'Kellys Bici Ibrida Phanatic 10 Dark Ocean.',
    },
  ]
}
async function createClientList(n = 200) {
  const password1 = await generateHash('gino2')
  const clientList = []
  const paymentList = ['Paypal', 'Mastercard', 'Visa']
  const genderList = ['Maschio', 'Femmina', 'Non specificato']
  const categoryList = ['e-Bike', 'Bici corsa', 'Monopattino', 'Bici']
  for (let i = 0; i < n; i += 1) {
    const email = `${Math.floor(Math.random() * 8000)}@gmail.com`
    const gender = genderList[Math.floor(Math.random() * 3)]
    const fidelityPoints = Math.floor(Math.random() * 8000)
    const payment = paymentList[Math.floor(Math.random() * 3)]
    const preferredCategories = categoryList[Math.floor(Math.random() * 4)]
    const dateStr = `${2021 - (Math.max(Math.floor((Math.random() * 75)), 16))}.2.2`
    const birthDate = new Date(dateStr).getTime()
    const name = `mario${Math.floor(Math.random() * 8000)}`
    const surname = `mario${Math.floor(Math.random() * 8000)}`
    const phoneNumber = `${Math.floor(Math.random() * 10000000000)}`
    const address = `via san mamolo ${Math.floor(Math.random() * 8000)}`
    const user = {
      email,
      name,
      surname,
      birthDate,
      address,
      phoneNumber,
      password: password1,
      preferredCategories,
      payment,
      fidelityPoints,
      favourites: ['61b1bfed920b3b3b7167f9ab'],
      notifications: ['61b1bfed920b3b3b7167f9ab'],
      gender,
    }
    clientList.push(user)
  }
  return clientList
}
async function createRentList(clients, inventory, offer, n = 500) {
  const clientIdList = await clients.find({}, 'id').exec()
  const productList = await inventory.find().exec()
  const offers = await offer.find().exec()
  const statusList = ['Noleggiato', 'Pagato']
  const rentList = []
  for (let i = 0; i < n; i += 1) {
    const client = clientIdList[Math.floor(Math.random() * clientIdList.length)]
    const clientCode = client.id
    let spendablefidelityPoints = client.fidelityPoints
    const product = productList[Math.floor(Math.random() * productList.length)]
    const { title } = product
    const productCode = product.id
    const year = 2022
    const month = Math.floor(Math.random() * 12) + 1
    let day = Math.floor(Math.random() * 28) + 1
    const start = new Date(`${year}.${month}.${day}`).getTime()
    day = Math.floor(Math.random() * (28 - day)) + day
    const end = new Date(`${year}.${month}.${day}`).getTime()
    let spentFidelityPointsTmp = 0
    let priceTmp = 0
    for (let j = start; j < end; j += 86400000) {
      let priceDay = 0
      const dayT = new Date(j)
      const isWeekend = dayT.getDay() === 0 || dayT.getDay() === 6
      if (spendablefidelityPoints > 0 && spendablefidelityPoints - product.price.fidelityPoints > 0) {
        spendablefidelityPoints -= product.price.fidelityPoints
        spentFidelityPointsTmp += product.price.fidelityPoints
      } else if (isWeekend) {
        priceDay = product.price.weekend
      } else {
        priceDay = product.price.weekday
      }
      offers.forEach((offerTmp) => {
        if (j >= offerTmp.start && j <= offerTmp.end) {
          priceDay = (priceDay * 100) / (100 - priceDay.discount)
        }
      })
      priceTmp += priceDay || 0
    }
    const fidelityPoints = spentFidelityPointsTmp
    const price = priceTmp
    const status = statusList[Math.floor(Math.random() * 2)]
    const daysBetweenDates = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    const earnedFidelityPoints = daysBetweenDates * 3
    const rentObj = { title, start, end, productCode, clientCode, price, fidelityPoints, earnedFidelityPoints, status }
    rentList.push(rentObj)
  }
  return rentList
}
function createOfferList() {
  return [
    {
      title: 'Super sconti',
      start: 1653673600000,
      end: 1656092800000,
      discount: 15,
    },
    {
      title: 'Sconti febbraio',
      start: 1643673600000,
      end: 1646092800000,
      discount: 15,
    },
  ]
}
function createCouponList() {
  return [
    {
      title: 'PROMO21',
      discount: 15,
      usage: 15,
    },
    {
      title: 'PROMO22',
      discount: 7,
      usage: 1,
    },
    {
      title: 'PROMOFEBRAIO',
      discount: 15,
      start: 1644405477904,
      end: 1644905477904,
    },
  ]
}
async function populate() {
  await mongoose.connect('mongodb://localhost:27017/nolo-nolo')
  const inventory = mongoose.model('inventories', inventorySchema)
  const offer = mongoose.model('offer', offerSchema)
  const rentals = mongoose.model('rentals', rentSchema)
  const employee = mongoose.model('employees', employeeSchema)
  const clients = mongoose.model('clients', clientSchema)
  const coupons = mongoose.model('coupons', couponSchema)
  const password2 = await generateHash('gino3')
  await employee.insertMany([{ email: 'mario@gmail.com', password: password2, role: 'manager' }])

  logger.info('Uploading products')
  const inventoryList = createInventoryList()
  logger.info(inventoryList.length)
  await inventory.insertMany(inventoryList)

  logger.info('Uploading clients')
  const clientList = await createClientList()
  logger.info(clientList.length)
  await clients.insertMany(clientList)

  logger.info('Uploading offers')
  const offerList = createOfferList()
  logger.info(offerList.length)
  await offer.insertMany(offerList)

  logger.info('Uploading rentals')
  const rentList = await createRentList(clients, inventory, offer)
  logger.info(rentList.length)
  await rentals.insertMany(rentList)
  logger.info('adding coupons')
  const couponList = createCouponList()
  coupons.insertMany(couponList)
}

// export default populate
populate()
