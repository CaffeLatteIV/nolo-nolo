import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'

const PRODUCT_URL = process.env.PRODUCT_URL || 'http://localhost:5000/v1/inventories/products'
function ProductPage() {
  const [product, setProduct] = useState(undefined)
  const { search } = useLocation()
  useEffect(async () => {
    const query = new URLSearchParams(search)
    const id = query.get('id')
    const { data } = await axios.get(`${PRODUCT_URL}/${id}`)
    setProduct(data.products)
  }, [])
  return (
    <>
      <div className="container mt-2 md-0dp rounded">
        <div className="row p-2">
          <h3 className="text-wrap p-2 rounded m-0">{ product ? product.title : 'Caricamento' }</h3>
        </div>
        <div className="row">
          {/* Contenitore immagine e collezione di immagini (?) */}
          <div className="col-sm-2 p-2">
            <div className="md-02dp rounded p-4 h-100">
              <div className="row">
                <img src={product ? product.media.img : ''} className="" alt="Immagine del prodotto" />
              </div>
            </div>
          </div>
          {/* Contenitore Titolo, Descrizione, Calendario */}
          <div className="col-sm-6 p-2">
            <div className="md-02dp rounded p-4 h-100">
              <p className="fw-bold m-0">Descrizione: </p>
              <p className="text-wrap">{ product ? product.description : 'Caricamento' }</p>
            </div>
          </div>
          {/* Contenitore Prezzo finale per i giorni selezionati sul calendario di cui sopra, Bottone Noleggia e Bottone aggiungi al carrello */}
          <div className="col-sm-4 p-2">
            <div className="md-02dp rounded p-4">
              <p className="fs-3 mb-0 text-center price">€ { product ? product.price.weekday : 'Caricamento' } </p>
              <div className="d-flex flex-column">
                <div className="p-2">
                  <button type="submit" className="w-100 rounded p-1 border-0 bg-site-primary">Aggiungi al carrello</button>
                </div>
                <div className="p-2">
                  <button type="submit" className="w-100 rounded p-1 border-0 bg-site-primary">Noleggia subito</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p style={{ color: 'yellow' }}>TODO: add Calendar</p>
    </>
  )
}
export default ProductPage
