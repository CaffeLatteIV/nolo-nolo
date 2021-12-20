import React, { useState, useEffect } from 'react'

function ProductCard () {
  const [productName, setProductName] = useState('undefined')
  const [price, setPrice] = useState(0.00)

  useEffect(() => {
    setProductName('prodotto')
    setPrice(9.99)
  })

  return (
        <div className="card p-0 border-0">
            <img src="" className="card-img-top" alt="First Item card"/>
            <div className="card-body">
                <h5 className="card-title">{ productName }</h5>
                <p className="card-text">Price: \${ price }/month</p>
            </div>
        </div>
  )
}

export default ProductCard
