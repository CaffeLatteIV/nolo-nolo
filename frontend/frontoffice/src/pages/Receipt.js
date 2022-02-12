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
  const { newRent, start, end, coupon } = state
  if (!newRent || !start || !end) navigate('*')
  const daysBetweenDates = Math.max(Math.ceil((end - start) / (1000 * 60 * 60 * 24)), 1) // almeno un giorno
  const earnedFidelityPoints = daysBetweenDates * newRent.fidelityPoints

  // count weekends tra le due date
  const [price, setPrice] = useState(0)
  const [spentFidelityPoints, setSpentFidelityPoints] = useState(0)
  useEffect(async () => {
    const { data } = await axios.get(`${URL_OFFERS}/`, {
      headers: { 'Content-Type': 'application/json' },
      params: { start, end },
    })
    const { offers } = data
    let priceTmp = 0
    let spentFidelityPointsTmp = 0
    // 86400000 = ms in a day
    for (let i = start; i < end; i += 86400000) {
      let priceDay = 0
      const day = new Date(i)
      const isWeekend = day.getDay() === 0 || day.getDay() === 6
      if (newRent.clientsFidelityPoints - newRent.price.points > 0) {
        newRent.clientsFidelityPoints -= newRent.price.points
        spentFidelityPointsTmp += newRent.price.points
      } else if (isWeekend) {
        priceDay = newRent.price.weekend
      } else {
        priceDay = newRent.price.weekday
      }
      if (offers) {
        offers.forEach((offer) => {
          if (i >= offer.start && i <= offer.end) {
            priceDay = (priceDay * 100) / (100 - offer.discount)
          }
        })
      }

      priceTmp += priceDay
    }
    if (coupon) {
      priceTmp = (priceTmp * 100) / (100 - coupon)
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
      status: 'Prenotato', // se l'utente conferma, lo status diventa prenotato
      fidelityPoints: spentFidelityPoints,
    }
    const accessToken = cookie.get('accessToken')
    await axios.post(
      `${RENTALS_URL}/add`,
      { product },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    )
    navigate('/orders')
  }
  return (
    <div className="container p-2">
      <div className="md-01dp p-4 mt-4 rounded">
        <h1>Riepilogo Ordine</h1>
        <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold">Codice prodotto:</span>
          </div>
          <div className="col-sm-6 col-md-9">{newRent.id}</div>
        </div>
        <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold">Titolo:</span>
          </div>
          <div className="col-sm-6 col-md-9">{newRent.title}</div>
        </div>
        <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold">Descrizione:</span>
          </div>
          <div className="col-sm-6 col-md-9">{newRent.description}</div>
        </div>
        <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold">Durata noleggio:</span>
          </div>
          <div className="col-sm-6 col-md-9">{daysBetweenDates} giorn{daysBetweenDates === 1 ? 'o' : 'i'}</div>
        </div>
        <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold">Prezzo giorni feriali:</span>
          </div>
          <div className="col-sm-6 col-md-9">{newRent.price.weekday}€</div>
        </div>
        <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold">Prezzo giorni festivi:</span>
          </div>
          <div className="col-sm-6 col-md-9">{newRent.price.weekend}</div>
        </div>
        <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold">Punti fedeltà spesi:</span>
          </div>
          <div className="col-sm-6 col-md-9">{spentFidelityPoints}
          </div>
        </div>
        <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold">Punti fedeltà guadagnati:</span>
          </div>
          <div className="col-sm-6 col-md-9">{earnedFidelityPoints}
          </div>
        </div>
        <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold">Sconto applicato:</span>
          </div>
          <div className="col-sm-6 col-md-9">{coupon ? `${coupon}%` : '-'}
          </div>
        </div>
        <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold fs-3">TOTALE:</span>
          </div>
          <div className="col-sm-6 col-md-9 fs-3">{price}€</div>
        </div>
        <button
          type="button"
          onClick={handleConfirm}
          className="btn text-black mt-4 bg-site-primary"
        >
          Conferma
        </button>
      </div>
    </div>
  )
}
export default Receipt
