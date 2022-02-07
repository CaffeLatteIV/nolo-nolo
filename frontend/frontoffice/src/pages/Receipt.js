/* eslint-disable no-loop-func */
/* eslint-disable dot-notation */
import React, { useEffect, useState } from 'react'
// import PropTypes from 'prop-types'
import { useNavigate, useLocation } from 'react-router-dom'
import Cookie from 'universal-cookie'
import axios from 'axios'

import validateAccessToken from '../components/Tokens.js'

const RENTALS_URL = process.env.RENTALS_URL || 'https://site202156.tw.cs.unibo.it/v1/rentals'
const URL_OFFERS = process.env.OFFERS_URL || 'https://site202156.tw.cs.unibo.it/v1/offers'
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
    const accessToken = cookie.get('accessToken')
    await axios.post(`${RENTALS_URL}/add`, { product }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    navigate('/orders')
  }
  return (
    <div className="container md-01dp p-4 mt-4 rounded">
      <h1>Riepilogo Ordine</h1>
      <table className="table">
        <tbody>
          <tr>
            <th className="scope text-white">Codice prodotto:</th>
            <td className="text-white">{newRent.id}</td>
          </tr>
          <tr>
            <th className="scope text-white">Titolo:</th>
            <td className="text-white">{newRent.title}</td>
          </tr>
          <tr>
            <th className="scope text-white">Descrizione:</th>
            <td className="text-white">{newRent.description}</td>
          </tr>
          <tr>
            <th className="scope text-white">Condizione:</th>
            <td className="text-white">{newRent.condition}</td>
          </tr>
          <tr>
            <th className="scope text-white">Durata noleggio:</th>
            <td className="text-white">{daysBetweenDates}</td>
          </tr>
          <tr>
            <th className="scope text-white">Prezzo giorni lavorativi:</th>
            <td className="text-white">{newRent.price.weekday}€</td>
          </tr>
          <tr>
            <th className="scope text-white">Prezzo giorni feriali:</th>
            <td className="text-white">{newRent.price.weekend}€</td>
          </tr>
          <tr>
            <th className="scope text-white">Punti fedeltà spesi:</th>
            <td className="{text-white} text-danger"> Nessuno (togliere parentesi graffe a text-white e rimuovere text-danger nelle classi)</td>
          </tr>
          <tr>
            <th className="scope text-white">Punti fedeltà guadagnati:</th>
            <td className="{text-white} text-danger"> un pochino (togliere parentesi graffe a text-white e rimuovere text-danger nelle classi)</td>
          </tr>
          <tr>
            <th className="scope text-white">Sconto applicato:</th>
            <td className="{text-white} text-danger"> - percent %  ovvero - (Totale-(Totale*0.percent)) € (togliere parentesi graffe a text-white e rimuovere text-danger nelle classi)</td>
          </tr>
          <tr>
            <th className="scope text-white fs-3">TOTALE:</th>
            <td className="text-white fs-3">{price}€</td>
          </tr>
        </tbody>
      </table>
      <button type="button" onClick={handleConfirm} className="btn text-black bg-site-primary">Conferma</button>
      <br />
      TODO: bottone conferma acquisto

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
