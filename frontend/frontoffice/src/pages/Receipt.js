/* eslint-disable dot-notation */
import React from 'react'
import moment from 'moment-business-days'
// import PropTypes from 'prop-types'
import { useNavigate, useLocation } from 'react-router-dom'
import Cookie from 'universal-cookie'
import axios from 'axios'
import validateAccessToken from '../components/Tokens.js'

const URL = process.env.ORDERS_URL || 'http://localhost:5000/v1/rentals'
function Receipt() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { newRent, start, end } = state
  if (!newRent) navigate('*')
  const daysBetweenDates = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  const businessDays = moment(end).businessDiff(moment(start))
  const holidayDays = daysBetweenDates - businessDays
  let price = ((newRent.price.weekdays * businessDays) || 0) + ((newRent.price.weekends * holidayDays) || 0)
  if (price <= 0) {
    price = (new Date(start).getDay() % 6) ? newRent.price.weekday : newRent.price.weekend
  }
  const earnedFidelityPoints = daysBetweenDates * newRent.fidelityPoints
  async function handleConfirm() {
    validateAccessToken()
    const cookie = new Cookie()
    const client = cookie.get('client')
    const product = {
      title: newRent.title,
      start,
      end,
      earnedFidelityPoints,
      productCode: newRent.id,
      clientCode: client.id,
      price,
      status: 'Prenotato', // se l'utente conferma lo status diventa prenotato
      fidelityPoints: newRent.fidelityPoints || 0,
    }
    console.log(product)
    console.log(client)
    const accessToken = cookie.get('accessToken')
    await axios.post(`${URL}/add`, { product }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    navigate('/orders')
  }
  return (
    <div>
      <h1>RIEPILOGO</h1>
      Codice prodotto: {newRent.id}
      <br />
      Titolo:{newRent.title}
      <br />
      Descrizione: {newRent.description}
      <br />
      condizione: {newRent.condition}
      <br />
      Prezzo: <div> <div>Giorni lavorativi: {newRent.price.weekday}€</div><div>Giorni feriali: {newRent.price.weekend}€</div> </div>
      <br />
      Durata noleggio: {daysBetweenDates}
      <br />
      TOTALE: {price}€
      <br />
      <button type="button" onClick={handleConfirm}>Conferma</button>
      <br />
      TODO: Design e bottone conferma acquisto

    </div>
  )
}
// Receipt.propTypes = {
//   start: PropTypes.number.isRequired,
//   end: PropTypes.number.isRequired,
//   // eslint-disable-next-line react/forbid-prop-types
//   product: PropTypes.object.isRequired,
// }
export default Receipt
