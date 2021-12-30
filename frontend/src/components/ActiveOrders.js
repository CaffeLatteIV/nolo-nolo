import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import productPic from '../images/product-pic.jpg'

function ActiveOrders ({ name, price }) {
  const finalDate = useState('gg/mm/aaaa')
  return (
    <>
    <Link to='/productpage' className='product-card-link'>
      <div className="p-2 px-3">
        <div className="row">
          <div className="col-2 p-2">
              <img src={ productPic } className="card-img" alt="Item Pic"/>
          </div>
          <div className='col-7 p-2'>
              <h3 className='m-0 text-wrap text-white'>{ name }</h3>
          </div>
          <div className='col-3 p-2 m-0 text-white fw-bold'>
              <p>Fino a:</p>
              <span>{ finalDate }</span>
          </div>
        </div>
      </div>
    </Link>
    <hr></hr>
    </>
  )
}
ActiveOrders.propTypes = { name: PropTypes.string.isRequired, price: PropTypes.number.isRequired }

export default ActiveOrders
