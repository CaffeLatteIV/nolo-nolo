import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'

function ActiveOrders({ productCode, id, title, price, start, end, img, handleDelete }) {
  return (
    <>
      <div className="p-2 px-3">
        <div className="row">
          <Link to={`/product?id=${productCode}`} className="product-card-link">
            <div className="col-2 p-2">
              <img src={img} className="card-img" alt="Item Pic" />
            </div>
          </Link>
          <div className="col-7 p-2">
            <h4 className="m-0 text-wrap text-white">{ title }</h4>
            <p className="text-white">{price}€</p>
          </div>
          <div className="col-lg-3 p-2 m-0 text-white text-center">
            Da: { dayjs(start).format('DD/MM/YYYY') }&nbsp;
            A: { dayjs(end).format('DD/MM/YYYY') }
          </div>
          <button type="button" onClick={() => handleDelete(id)}>delete</button>
        </div>
      </div>
      <hr />
    </>
  )
}
ActiveOrders.propTypes = {
  id: PropTypes.string.isRequired,
  productCode: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  start: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
  handleDelete: PropTypes.func.isRequired,
}

export default ActiveOrders
