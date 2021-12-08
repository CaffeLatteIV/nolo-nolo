import mongoose from 'mongoose'

const { Schema } = mongoose

const inventorySchema = new Schema({
  _codice: Schema.Types.ObjectId,
  disponibile: Boolean,
  prezzo: Number,
  condizione: String,
  categoria: String,
  titolo: String,
  descrizione: String,
})
const noleggiSchema = new Schema({
  inizio: Number,
  fine: Number,
  codiceProdotto: Schema.Types.ObjectId,
  codiceUtente: Schema.Types.ObjectId,
  prezzo: Number,
  coupon: Number,
})
const notificheSchema = new Schema({
  codiceProdotto: Schema.Types.ObjectId,
  codiceCliente: Schema.Types.ObjectId,
})
const clienteSchema = new Schema({
  _codice: Schema.Types.ObjectId,
  username: String,
  password: String,
  preferenzeOggetti: [String],
  pagamento: String,
  punti: Number,
  preferiti: [inventorySchema],
  notifiche: [notificheSchema],
})

export {
  inventorySchema,
  noleggiSchema,
  notificheSchema,
  clienteSchema,
}
