import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'

function OlderOrders({ id, productCode, title, price, start, end, img, paid }) {
  const navigate = useNavigate()
  function handlePay() {
    navigate('/payment', { state: { id, end } })
  }
  return (
    <>
      <div className="row">
        <div className={paid ? 'col-12' : 'col-10'}>
          <Link to={`/product?id=${productCode}`} className="product-card-link">
            <div className="p-2 px-3">
              <div className="row">
                <div className="col-lg-2 col-sm-12 p-2">
                  <img src={img} className="card-img" alt="Item Pic" />
                </div>
                <div className="col-lg-7 col-sm-12 p-2">
                  <h4 className="m-0 text-wrap text-white">{title}</h4>
                  <p className="text-white">{price}€</p>
                </div>
                <div className="col-lg-6 col-sm-9 p-2 m-0 text-white text-center">
                  Da: {dayjs(start).format('DD/MM/YYYY')}&nbsp;
                  A: {dayjs(end).format('DD/MM/YYYY')}
                </div>

              </div>
            </div>
          </Link>
        </div>
        {paid ? '' : (
          <div className="col-2 d-flex flex-column pt-3">
            <button type="button" className="w-100 border-0 rounded bg-site-primary h-25" onClick={handlePay}>Restituisci</button>
          </div>
        )}
      </div>

      <hr />
    </>
  )
}
OlderOrders.propTypes = {
  img: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  productCode: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  start: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
  paid: PropTypes.bool.isRequired,
}

export default OlderOrders
