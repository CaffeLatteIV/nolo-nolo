/* eslint-disable dot-notation */
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import axios from 'axios'
import Cookies from 'universal-cookie'
import Favourites from '../components/Favourites.js'
import validateAccessToken from '../components/Tokens.js'

const PRODUCT_URL = process.env.PRODUCT_URL || 'http://localhost:5000/v1/inventories'
const RENTALS_URL = process.env.RENTALS_URL || 'http://localhost:5000/v1/rentals'
const COUPON_URL = process.env.COUPON_URL || 'http://localhost:5000/v1/coupons'
function ProductPage() {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [available, setAvailable] = useState(false)
  const [couponCode, setCouponCode] = useState(undefined)
  const [product, setProduct] = useState(undefined)
  const [useFidelityPoints, setUseFidelityPoints] = useState(false)
  const [couponValid, setCouponValid] = useState(true)
  const { search } = useLocation()
  const query = new URLSearchParams(search)
  const id = query.get('id')
  const navigate = useNavigate()
  const cookies = new Cookies()
  const client = cookies.get('client')
  // se il parametro id non è presente restituisce la pagina 404
  if (id === null) {
    navigate('*') // \* = route per pagina 404
  }
  const handleDateChange = async (dates) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
    if (start && end) {
      await validateAccessToken()
      const accessToken = cookies.get('accessToken')
      const { data } = await axios.post(`${RENTALS_URL}/available`, {
        start: new Date(start).getTime(),
        end: new Date(end).getTime(),
        productCode: id,

      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json; charset=UTF-8',
        },
        validateStatus: false,
      })
      setAvailable(data.available || false)
    }
  }
  useEffect(async () => {
    const { data } = await axios.get(`${PRODUCT_URL}/products/${id}`)
    setProduct(data.products)
  }, [])

  async function rent() {
    if (couponCode) {
      await validateAccessToken()
      const accessToken = cookies.get('accessToken')
      const { data } = await axios.post(`${COUPON_URL}/use`, { clientCode: client.id, id: couponCode }, { headers: { Authorization: `Bearer ${accessToken}` } })
      if (data.coupon) {
        setCouponValid(true)
        setCouponCode(data.coupon)
      } else {
        setCouponValid(false)
      }
    }
    if (useFidelityPoints) product.clientsFidelityPoints = client.fidelityPoints
    navigate('/receipt', {
      state: { newRent: product, start: new Date(startDate).getTime(), end: new Date(endDate).getTime(), couponCode },
    }) // ms in a day
  }
  return (
    <div className="container mt-2 md-0dp rounded">
      <div className="row p-2" />
      <div className="row">
        {/* Contenitore immagine e collezione di immagini (?) */}
        <div className="col-sm-2 p-2">
          <div className="md-02dp rounded p-4">
            <div className="row">
              <img
                src={product ? product.media.img : ''}
                className=""
                alt="Immagine del prodotto"
              />
            </div>
          </div>
        </div>
        {/* Contenitore Titolo, Descrizione, Calendario */}
        <div className="col-sm-6 p-2">
          <div className="md-02dp rounded p-4 h-100">
            <h3 className="text-wrap p-2 pt-0 ps-0 rounded m-0 mb-2">
              {product ? product.title : 'Caricamento'}
            </h3>
            <DatePicker
              selected={startDate}
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={async (date) => handleDateChange(date)}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              scrollableMonthYearDropdown
              withPortal
              placeholderText="Inserisci periodo"
              className="rounded border-0 text-white px-2 py-1 mb-3 w-100"
              calendarClassName="text-white border-0"
              id="datepicker"
            />
            <p className="fw-bold m-0">Descrizione: </p>
            <p className="text-wrap">
              {product ? product.description : 'Caricamento'}
            </p>
          </div>
        </div>
        {/* Contenitore Prezzo finale per i giorni selezionati sul calendario di cui sopra, Bottone Noleggia e Bottone aggiungi al carrello */}
        <div className="col-sm-4 p-2">
          <div className="md-02dp rounded p-4">
            <div className="d-flex flex-column justify-content-between h-100">
              <h5 className="text-center">Prezzo totale:</h5>
              <p className="fs-3 mb-4 text-center price">
                € {product ? product.price.weekday : 'Caricamento'}{' '}
              </p>
              <label htmlFor="inputCodiceSconto" className="text-white">
                Inserire codice sconto:
                <input type="text" id="inputCodiceSconto" className="form-control rounded text-white border-0 w-100 m-0" onChange={(e) => { setCouponCode(e.target.value) }} value={couponCode} />
                {!couponValid ? <span> Il coupon è scaduto o già stato usato</span> : ''}
              </label>
              <label className="mt-4" htmlFor="fidelityCheckbox">
                <input
                  id="fidelityCheckbox"
                  className="me-1"
                  type="checkbox"
                  value={useFidelityPoints}
                  onChange={(event) => {
                    setUseFidelityPoints(event.target.checked)
                  }}
                />
                Voglio usare i punti fedeltà
              </label>
              <div className="p-2 row">
                <Favourites id={id} clientCode={client.id} />
                <div className="col-10  px-0">
                  {available ? (
                    <button
                      type="submit"
                      className="col-10 w-100 h-100 rounded p-1 border-0 bg-site-primary"
                      onClick={rent}
                    >
                      Procedi con il noleggio
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="col-10 w-100 h-100 rounded p-1 border-0 bg-site-primary"
                    >
                      Procedi con il noleggio
                    </button>
                  )}
                </div>
              </div>
              {/* controllo se la data sia disponibile */}
              {!available ? <span> Le date selezionate non sono disponibili</span> : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ProductPage
