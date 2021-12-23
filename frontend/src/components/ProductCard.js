import React, { useState, useEffect } from 'react'

import productPic from '../images/product-pic.jpg'

function ProductCard () {
  const [productName, setProductName] = useState('undefined')
  const [price, setPrice] = useState(0.00)

  useEffect(() => {
    setProductName('prodotto')
    setPrice(9.99)
  })

  return (
    <div className="card p-2 border-0 md-02dp">
        <img src={productPic} className="card-img-top" alt="Item Pic"/>
        <div className="card-body p-2">
            <h5 className="card-title text-white">{ productName }</h5>
            <p className="card-text text-white">Price: <span className="tw-bold m-0 p-0">{ price }</span>/month</p>
        </div>
    </div>
  )
}

export default ProductCard
