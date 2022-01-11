import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

function ProductCard({ id, title, price, condition, img }) {
  return (
    <Link to={`/product?id=${id}`} className="product-card-link">
      <div className="card p-2 border-0 md-02dp">
        <img src={img} className="card-img-top" alt="Item Pic" />
        <div className="card-body p-2">
          <h5 className="card-title text-white">{ title }</h5>
          <p className="card-text text-white">Condition: {condition}</p>
          <p className="card-text text-white">Price: <span className="tw-bold m-0 p-0">{ price }</span>/month</p>
        </div>
      </div>
    </Link>
  )
}
ProductCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  condition: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
}
export default ProductCard
