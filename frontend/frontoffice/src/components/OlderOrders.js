import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'

function OlderOrders({ id, title, price, start, end, img }) {
  return (
    <>
      <div className="row">
        <div className="col-10">
          <Link to={`/product?id=${id}`} className="product-card-link">
            <div className="p-2 px-3">
              <div className="row">
                <div className="col-2 p-2">
                  <img src={img} className="card-img" alt="Item Pic" />
                </div>
                <div className="col-7 p-2">
                  <h4 className="m-0 text-wrap text-white">{title}</h4>
                  <p className="text-white">{price}€</p>
                </div>
                <div className="col-3 p-2 m-0 text-white text-center">
                  Da: {dayjs(start).format('DD/MM/YYYY')}&nbsp;
                  A: {dayjs(end).format('DD/MM/YYYY')}
                </div>

              </div>
            </div>
          </Link>
        </div>
        <div className="col-2 d-flex flex-column pt-3">
          <button type="button" className="w-100 border-0 rounded bg-site-primary h-25">Restituisci</button>
        </div>
      </div>

      <hr />
    </>
  )
}
OlderOrders.propTypes = {
  img: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  start: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
}

export default OlderOrders
