import React from 'react'

import ProductCard from '../components/ProductCard.js'
import Carousel from '../components/Carousel.js'

function Homepage() {
  document.title = 'NOLONOLO'
  return (
    <div className="container p-2">
      <div className="p-1">
        <Carousel />
      </div>
      <div className="container-fluid row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 row-cols-xxl-6 p-0 m-0" id="card-container">
        { Array.from({ length: 30 }, (_, i) => (
          <div className="col p-1">
            <ProductCard id={i} productName="wooo" price={40} />
          </div>
        ))}
      </div>
    </div>

  )
}

export default Homepage
