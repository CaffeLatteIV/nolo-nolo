import React from 'react'
// import PropTypes from 'prop-types'
import { useNavigate, useLocation } from 'react-router-dom'
import Cookie from 'universal-cookie'
import axios from 'axios'
import validateAccessToken from '../components/Tokens.js'

const RENTALS_URL = process.env.RENTALS_URL || 'http://localhost:5000/v1/rentals'
function Receipt() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { receipt, product } = state
  if (!receipt) navigate('*')
  const daysBetweenDates = Math.ceil(((receipt.end - receipt.start) / 86400000) + 1)
  async function handleConfirm() {
    await validateAccessToken()
    const cookie = new Cookie()
    const accessToken = cookie.get('accessToken')
    await axios.post(
      `${RENTALS_URL}/add`,
      { rentalInfo: receipt },
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
          <div className="col-sm-6 col-md-9">{receipt.productCode}</div>
        </div>
        <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold">Titolo:</span>
          </div>
          <div className="col-sm-6 col-md-9">{receipt.title}</div>
        </div>
        {/* <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold">Descrizione:</span>
          </div>
          <div className="col-sm-6 col-md-9">{receipt.description}</div>
        </div> */}
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
          <div className="col-sm-6 col-md-9">{product.price.weekday}€</div>
        </div>
        <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold">Prezzo giorni festivi:</span>
          </div>
          <div className="col-sm-6 col-md-9">{product.price.weekend}€</div>
        </div>
        <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold">Punti fedeltà spesi:</span>
          </div>
          <div className="col-sm-6 col-md-9">{receipt.fidelityPoints}
          </div>
        </div>
        <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold">Punti fedeltà guadagnati:</span>
          </div>
          <div className="col-sm-6 col-md-9">{receipt.earnedFidelityPoints}
          </div>
        </div>
        <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold">Eventuale sconto applicato:</span>
          </div>
          <div className="col-sm-6 col-md-9">{receipt.coupon ? `${receipt.coupon}%` : '-'}
          </div>
        </div>
        <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold fs-3">TOTALE:</span>
          </div>
          <div className="col-sm-6 col-md-9 fs-3">{receipt.price}€</div>
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
