import mongoose from 'mongoose'
import { inventorySchema, rentSchema, clientSchema, employeeSchema, offerSchema } from './schema.js'

async function populate() {
  const db = await mongoose.connect('mongodb://localhost:27017/nolo-nolo')

  const inventory = db.model('inventories', inventorySchema)
  const offer = db.model('offer', offerSchema)
  // const rentals = db.model('rentals', rentSchema)
  // const employee = db.model('employees', employeeSchema)
  // const clients = db.model('clients', clientSchema)
  // await clients.insertMany([
  //   {
  //     email: 'mario',
  //     password: 'gino2',
  //     preferredCategories: ['Bici'],
  //     payment: 'PayPal',
  //     fidelityPoints: 32,
  //     favourites: ['61b1bfed920b3b3b7167f9ab'],
  //     notifications: ['61b1bfed920b3b3b7167f9ab'],
  //   },
  // ])
  // await inventory.insertMany([
  //   {
  //     available: true,
  //     price: {
  //       weekend: 25,
  //       weekday: 15,
  //       points: 200,
  //     },
  //     condition: 'Ottima',
  //     category: 'Bici',
  //     title: 'Esperia Mtb Michigan',
  //     description: 'Mountain Bike 26" da ragazzo caratterizzata da telaio in acciaio, forcella ammortizzata acciaio, cambio Shimano TZ500 21V, comandi 7x3V con leve freno integrate, freni v-brake alluminio e cerchi alluminio con coperture 26x1,95.',
  //   },
  //   {
  //     available: true,
  //     price: {
  //       weekend: 35,
  //       weekday: 25,
  //       points: 350,
  //     },
  //     media: { img: 'http://localhost:5000/v1/image/cervelo-bici-gravel-aspero-apex-1-seabreeze-blue.jpg' },
  //     condition: 'Ottima',
  //     category: 'Bici corsa',
  //     title: 'Cervelo Bici Gravel Aspero',
  //     description: 'Cervelo Bici Gravel Aspero Apex 1 Seabreeze/Blue ',
  //     stock: 5,
  //   },
  //   {
  //     available: false,
  //     price: {
  //       weekend: 25,
  //       weekday: 15,
  //       points: 100,
  //     },
  //     condition: 'Buona',
  //     category: 'Bici',
  //     title: 'Esperia Mtb Michigan',
  //     description: 'Mountain Bike 26" da ragazzo caratterizzata da telaio in acciaio, forcella ammortizzata acciaio, cambio Shimano TZ500 21V, comandi 7x3V con leve freno integrate, freni v-brake alluminio e cerchi alluminio con coperture 26x1,95.',
  //   },
  //   {
  //     available: true,
  //     price: {
  //       weekend: 6,
  //       weekday: 9,
  //       points: 150,
  //     },
  //     media: { img: 'http://localhost:5000/v1/image/prismalia-monopattino-elettrico-85-pollici-36v-10a-400-w.jpg' },
  //     condition: 'Ottima',
  //     category: 'Monopattino',
  //     title: 'Prismalia Monopattino Elettrico 8.5 pollici',
  //     description: 'Uno dei migliori monopattini presenti sul mercato unisce doti di agilità e robustezza, grazie al doppio ammortizzatore posteriore riesce ad affrontare senza problemi superfici disconnesse, il sistema di sgancio anteriore è particolarmente robusto e non assume giochi anche dopo un utilizzo continuo, il monopattino è dotato altre che di un freno posteriore a disco di ben 110 mm anche di uno anteriore kers con recupero di energia è possibile scaricare sul proprio telefonino un App gratuita che oltre ad monitorare tutti i dati del mezzo aggiunge la possibilità di inserire il cruise control e persino bloccare il mezzo con  antifurto.',
  //   },
  //   {
  //     available: true,
  //     price: {
  //       weekend: 25,
  //       weekday: 15,
  //       points: 170,
  //     },
  //     media: { img: 'http://localhost:5000/v1/image/ghost-e-riot-trail-cf-advanced-29-12v-brown.jpg' },
  //     condition: 'Ottima',
  //     category: 'e-Bike',
  //     title: 'Ghost E-Riot Trail CF Advanced',
  //     description: 'Ghost E-Riot Trail CF Advanced 29\'\' 12v Brown',
  //   },
  //   {
  //     available: true,
  //     price: {
  //       weekend: 30,
  //       weekday: 20,
  //       points: 150,
  //     },
  //     condition: 'Ottima',
  //     category: 'Bici Ibrida',
  //     title: 'Kellys Bici Ibrida Phanatic',
  //     description: 'Kellys Bici Ibrida Phanatic 10 Dark Ocean.',
  //   },
  // ])
  await offer.insertMany([
    // {
    //   title: 'Super sconti',
    //   start: 1653673600000,
    //   end: 1656092800000,
    //   discount: 15,
    // },
    // {
    //   title: 'Sconti febbraio',
    //   start: 1643673600000,
    //   end: 1646092800000,
    //   discount: 15,
    // },
    {
      title: 'Sconti Fine gennaio',
      start: 1642848840000,
      end: 1643626440000,
      discount: 18,
    }])
}
// populate()
