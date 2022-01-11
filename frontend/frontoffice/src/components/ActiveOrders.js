import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import productPic from '../images/product-pic.jpg'

function ActiveOrders({ id, title, price, start, end }) {
  return (
    <>
      <Link to={`/product?id=${id}`} className="product-card-link">
        <div className="p-2 px-3">
          <div className="row">
            <div className="col-2 p-2">
              <img src={productPic} className="card-img" alt="Item Pic" />
            </div>
            <div className="col-7 p-2">
              <h4 className="m-0 text-wrap text-white">{ title }</h4>
              <p className="text-white">{price}€</p>
            </div>
            <div className="col-lg-3 p-2 m-0 text-white text-center">
              Da: { dayjs(start).format('DD/MM/YYYY') }&nbsp;
              A: { dayjs(end).format('DD/MM/YYYY') }
            </div>
          </div>
        </div>
      </Link>
      <hr />
    </>
  )
}
ActiveOrders.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  start: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
}

export default ActiveOrders
