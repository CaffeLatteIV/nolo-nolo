import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import productPic from '../images/product-pic.jpg'

function CartItem({ name, price }) {
  const [quantity, setQuantity] = useState(1)
  const addOne = () => {
    setQuantity(quantity + 1)
  }
  const subOne = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }
  return (
    <Link to="/productpage" className="product-card-link">
      <div className="p-2 px-3">
        <div className="row">
          <div className="col-2 p-2">
            <img src={productPic} className="card-img" alt="Item Pic" />
          </div>
          <div className="col-7 p-2">
            <h5 className="m-0 text-wrap fs-4 text-white">{ name }</h5>
          </div>
          <div className="col-3 p-2 text-end m-0 price fs-4 fw-bold">€{ price }</div>
        </div>
        <div className="row mt-4">
          <div className="col-4 p-2 d-flex justify-content-evenly">
            <button type="submit" className="rounded w-100 p-0 border-0 bg-site-primary fw-bold pb-1" onClick={subOne} aria-disabled={quantity === 1} id="canBeDisabled">-</button>
            <span className="w-100 text-center text-white">{quantity}</span>
            <button type="submit" className="rounded w-100 p-0 border-0 bg-site-primary fw-bold pb-1" onClick={addOne}>+</button>
          </div>
          <div className="col-6 p-2" />
          <div className="col-2 p-2 ">
            <button type="submit" className="w-100 px-0 bg-self-red border-0 rounded material-icons text-black h-100">delete</button>
          </div>
        </div>
      </div>
    </Link>
  )
}
CartItem.propTypes = { name: PropTypes.string.isRequired, price: PropTypes.number.isRequired }

export default CartItem
