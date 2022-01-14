/* eslint-disable dot-notation */
import React from 'react'
import moment from 'moment-business-days'
// import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import Cookie from 'universal-cookie'
import axios from 'axios'
import validateAccessToken from '../components/Tokens.js'

const URL = process.env.ORDERS_URL || 'http://localhost:5000/v1/rentals'
function Receipt() {
  const cookie = new Cookie()
  const { newRent, start, end } = cookie.get('rent')
  const navigate = useNavigate()
  if (!newRent) navigate('*')
  const daysBetweenDates = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  const businessDays = moment(end).businessDiff(moment(start))
  const holidayDays = daysBetweenDates - businessDays
  const price = ((newRent.price.weekdays * businessDays) || 0) + ((newRent.price.weekends * holidayDays) || 0)

  function handleConfirm() {
    validateAccessToken()
    const client = cookie.get('client')
    const product = {
      title: newRent.title,
      start,
      end,
      productCode: newRent['_id'],
      clientCode: client['_id'],
      price,
      status: 'Prenotato',
      fidelityPoints: newRent.fidelityPoints || 0,
    }
    console.log(product)
    const accessToken = cookie.get('accessToken')
    axios.post(`${URL}/add`, { product }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    navigate('/orders')
  }
  return (
    <div>
      Codice prodotto: {newRent['_id']}
      <br />
      Titolo:{newRent.title}
      <br />
      Descrizione: {newRent.description}
      <br />
      condizione: {newRent.condition}
      <br />
      Prezzo: <div> <div>Giorni lavorativi:{newRent.price.weekdays}</div><div>Giorni feriali: {newRent.price.weekends}</div> </div>
      <br />
      Durata noleggio: {daysBetweenDates}
      <br />
      TOTALE: {price}
      <button type="button" onClick={handleConfirm}>Conferma</button>
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
