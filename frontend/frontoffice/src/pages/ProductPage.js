/* eslint-disable dot-notation */
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import axios from 'axios'
import Cookies from 'universal-cookie'
import Favourites from '../components/Favourites.js'

const PRODUCT_URL = process.env.PRODUCT_URL || 'http://localhost:5000/v1/inventories'
function ProductPage() {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const handleDateChange = (dates) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }
  const [product, setProduct] = useState(undefined)
  const [useFidelityPoints, setUseFidelityPoints] = useState(false)
  const { search } = useLocation()
  const query = new URLSearchParams(search)
  const id = query.get('id')
  const navigate = useNavigate()
  // se il parametro id non è presente restituisce la pagina 404
  if (id === null) {
    navigate('*') // \* = route per pagina 404
  }
  useEffect(async () => {
    const { data } = await axios.get(`${PRODUCT_URL}/products/${id}`)
    setProduct(data.products)
  }, [])
  const cookies = new Cookies()
  const client = cookies.get('client')
  function rent() {
    // TODO prendere i parametri inseriti dall'utente
    if (useFidelityPoints) product.useFidelityPoints = client.fidelityPoints
    navigate('/receipt', {
      state: { newRent: product, start: startDate, end: endDate },
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
              onChange={(date) => handleDateChange(date)}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              scrollableMonthYearDropdown
              withPortal
              placeholderText="Inserisci periodo"
              className="rounded border-0 text-white px-2 py-1 mb-3"
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
                <input type="text" id="inputCodiceSconto" className="form-control rounded text-white border-0 w-100 m-0" />
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
                  <button
                    type="submit"
                    className="col-10 w-100 h-100 rounded p-1 border-0 bg-site-primary"
                    onClick={rent}
                  >
                    Procedi con il noleggio
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ProductPage
