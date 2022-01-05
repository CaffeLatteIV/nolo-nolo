import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ProductCard from '../components/ProductCard.js'
import Carousel from '../components/Carousel.js'

const URL = process.env.INVENTORY_URL || 'http://localhost:5000/v1/inventories'
function Homepage() {
  const [products, setProducts] = useState(undefined)
  // viene eseguito una volta sola (alla prima visita della pagina)
  useEffect(async () => {
    const { data } = await axios({
      method: 'GET',
      url: `${URL}/products`,
    })
    setProducts(data.products)
  }, [])

  document.title = 'NOLONOLO'
  return (
    <div className="container p-2">
      <div className="p-1">
        <Carousel />
      </div>
      <div className="container-fluid row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 row-cols-xxl-6 p-0 m-0" id="card-container">
        { products ? products.map(({ _id, title, price, condition }) => (
          <div key={_id} className="col p-1">
            <ProductCard productName={title} condition={condition} price={price.weekday} />
          </div>
        )) : 'caricamento...'}
      </div>
    </div>

  )
}

export default Homepage
