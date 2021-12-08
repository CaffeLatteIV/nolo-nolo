import mongoose from 'mongoose'
import { inventorySchema, noleggiSchema, notificheSchema, clienteSchema } from './schema.js'

const URL = 'mongodb://localhost:27017/nolo-nolo'
async function main() {
  await mongoose.connect(URL)
  const Inventory = mongoose.model('Inventory', inventorySchema)
  const noleggi = mongoose.model('Noleggi', noleggiSchema)
  const notifiche = mongoose.model('Notifiche', notificheSchema)
  const clienti = mongoose.model('Clienti', clienteSchema)
  const test = new Inventory({
    disponibile: true,
    pezzo: 50,
    condizione: 'danneggiato',
    categoria: 'Bici',
    titolo: 'Mountain bike',
    descrizione: 'Descrizione bici',
  })
  await test.save()
}
main()
