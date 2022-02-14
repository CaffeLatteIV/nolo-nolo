import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'

function ActiveOrders({ productCode, id, title, price, start, end, img, handleDelete }) {
  return (
    <>
      <div className="p-2 px-3">
        <div className="row">
          <div className="col-lg-2 col-sm-12 p-2">
            <Link to={`/product?id=${productCode}`} className="product-card-link">
              <img src={img} className="card-img" alt="Item Pic" />
            </Link>
          </div>
          <div className="col-lg-7 col-sm-12 p-2">
            <h4 className="text-wrap text-white">{ title }</h4>
            <p className=" ps-4text-white">{price}€</p>
          </div>
          <div className="col-lg-3 col-sm-12 p-2 m-0 text-white text-center">
            <div className="row">
              <div className="col-lg-6 col-sm-9">
                Da: { dayjs(start).format('DD/MM/YYYY') }&nbsp;
                A: { dayjs(end).format('DD/MM/YYYY') }
              </div>
              <div className="col-lg-6 col-sm-3">
                <button type="button" className="bg-transparent rounded border-0" onClick={() => handleDelete(id)}>
                  <span className="material-icons text-white pt-2">delete</span>
                </button>
              </div>
            </div>
          </div>

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
