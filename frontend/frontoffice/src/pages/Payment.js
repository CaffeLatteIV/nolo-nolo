import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Cookies from 'universal-cookie'
import validateAccessToken from '../components/Tokens.js'

const RENTALS_URL = process.env.RENTALS_URL || 'http://localhost:5000/v1/rentals'
function Payment() {
  const { state } = useLocation()
  const { productCode, id } = state
  const [lateFee, setLateFee] = useState('')
  const [price, setPrice] = useState('')
  const [rentData, setRentData] = useState(undefined)
  const [daysBetween, setdaysBetween] = useState('')
  useEffect(async () => {
    await validateAccessToken()
    const cookie = new Cookies()
    const accessToken = cookie.get('accessToken')
    const { data } = await axios.post(`${RENTALS_URL}/paymentInfo/${id}`, {}, { headers: { Authorization: `Bearer ${accessToken}` } })

    setPrice(data.fee > 0 ? data.rent.price + data.fee : data.rent.price)
    setRentData(data.rent)
    setdaysBetween(data.daysBetween)
    setLateFee(data.fee)
  }, [])
  const navigate = useNavigate()
  async function handlePay() {
    await validateAccessToken()
    const cookie = new Cookies()
    const accessToken = cookie.get('accessToken')
    await axios.post(`${RENTALS_URL}/pay/${id}`, {}, { headers: { Authorization: `Bearer ${accessToken}` } })
    navigate('/orders')
  }
  return rentData ? (
    <div className="container p-2">
      <div className="md-01dp p-4 mt-4 rounded">
        <h1>Riepilogo Ordine</h1>
        <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold">Codice prodotto:</span>
          </div>
          <div className="col-sm-6 col-md-9">{productCode}</div>
        </div>
        <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold">Titolo:</span>
          </div>
          <div className="col-sm-6 col-md-9">{rentData.productCode.title}</div>
        </div>
        <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold">Descrizione:</span>
          </div>
          <div className="col-sm-6 col-md-9">{rentData.productCode.description}</div>
        </div>
        <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold">Durata noleggio:</span>
          </div>
          <div className="col-sm-6 col-md-9">{Math.floor((rentData.end - rentData.start) / 86400000)} giorni{daysBetween > 0 ? ` + ${daysBetween} di ritardo` : ' '}</div>
        </div>
        <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold">Prezzo giorni feriali:</span>
          </div>
          <div className="col-sm-6 col-md-9">{rentData.productCode.price.weekday}€</div>
        </div>
        <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold">Prezzo weekend:</span>
          </div>
          <div className="col-sm-6 col-md-9">{rentData.productCode.price.weekend}€</div>
        </div>
        <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold">Punti fedeltà spesi:</span>
          </div>
          <div className="col-sm-6 col-md-9">{rentData.fidelityPoints}
          </div>
        </div>
        <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold">Punti fedeltà guadagnati:</span>
          </div>
          <div className="col-sm-6 col-md-9">{rentData.earnedFidelityPoints}
          </div>
        </div>
        {/* <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold">Sconto applicato:</span>
          </div>
          <div className="col-sm-6 col-md-9">{coupon ? `${coupon}%` : '-'}
          </div>
        </div> */}
        { (lateFee > 0) ? (
          <div className="row border-bottom border-secondary p-2">
            <div className="col-sm-6 col-md-3">
              <span className="fw-bold">Tassa di ritardo:</span>
            </div>
            <div className="col-sm-6 col-md-9">{lateFee}
            </div>
          </div>
        ) : ''}

        <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold fs-3">TOTALE:</span>
          </div>
          <div className="col-sm-6 col-md-9 fs-3">{price}€</div>
        </div>
        <button
          type="button"
          className="btn text-black mt-4 bg-site-primary"
          onClick={handlePay}
        >
          Paga e restituisci
        </button>
      </div>
    </div>
  ) : 'caricamento...'
}

export default Payment
