import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import productPic from '../images/product-pic.jpg'

function BookedOrders({ name, price }) {
  const finalDate = useState('gg/mm/aaaa')
  const startingDate = useState('gg/mm/aaaa')
  return (
    <>
      manca {price}
      <Link to="/productpage" className="product-card-link">
        <div className="p-2 px-3">
          <div className="row">
            <div className="col-2 p-2">
              <img src={productPic} className="card-img" alt="Item Pic" />
            </div>
            <div className="col-7 p-2">
              <h4 className="m-0 text-wrap text-white">{ name }</h4>
            </div>
            <div className="col-lg-3 p-2 m-0 text-white text-center">
              <div>
                Da: {startingDate}
              </div>
              <div>
                Fino a: {finalDate}
              </div>
            </div>
          </div>
        </div>
      </Link>
      <hr />
    </>
  )
}
BookedOrders.propTypes = { name: PropTypes.string.isRequired, price: PropTypes.number.isRequired }

export default BookedOrders
