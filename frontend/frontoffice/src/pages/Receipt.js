/* eslint-disable no-loop-func */
/* eslint-disable dot-notation */
import React, { useEffect, useState } from 'react'
// import PropTypes from 'prop-types'
import { useNavigate, useLocation } from 'react-router-dom'
import Cookie from 'universal-cookie'
import axios from 'axios'
import validateAccessToken from '../components/Tokens.js'

const URL = process.env.ORDERS_URL || 'http://localhost:5000/v1/rentals'
const URL_OFFERS = process.env.OFFERS_URL || 'http://localhost:5000/v1/offers'
function Receipt() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { newRent, start, end } = state
  if (!newRent) navigate('*')
  const daysBetweenDates = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  const earnedFidelityPoints = daysBetweenDates * newRent.fidelityPoints
  // count weekends tra le due date
  const [price, setPrice] = useState(0)
  const [spentFidelityPoints, setSpentFidelityPoints] = useState(0)
  useEffect(async () => {
    console.log(start)
    const { data } = await axios.get(`${URL_OFFERS}/`, { headers: { 'Content-Type': 'application/json' }, params: { start, end } })
    const { offers } = data
    let priceTmp = 0
    let spentFidelityPointsTmp = 0
    for (let i = start; i < end; i += 86400000) {
      let priceDay = 0
      const day = new Date(i)
      const isWeekend = day.getDay() === 0 || day.getDay() === 6
      if (newRent.spendablefidelityPoints > 0 && newRent.spendablefidelityPoints - newRent.price.fidelityPoints > 0) {
        newRent.spendablefidelityPoints -= newRent.price.fidelityPoints
        spentFidelityPointsTmp += newRent.price.fidelityPoints
      } else if (isWeekend) {
        priceDay = newRent.price.weekend
      } else {
        priceDay = newRent.price.weekday
      }
      offers.forEach((offer) => {
        if (i >= offer.start && i <= offer.end) {
          priceDay = (priceTmp * 100) / (100 - offer.discount)
        }
      })
      priceTmp += priceDay
    }
    setSpentFidelityPoints(spentFidelityPointsTmp)
    setPrice(priceTmp)
  }, [])
  async function handleConfirm() {
    await validateAccessToken()

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
      fidelityPoints: spentFidelityPoints,
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
