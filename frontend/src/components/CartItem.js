import React, { useState } from 'react'
import productPic from '../images/product-pic.jpg'

function CartItem () {
  // this code is not for production, it's just for crafting the frontend
  const productTitle = useState('Prodotto')
  const price = useState(13.50)
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
    <>
    <div className="p-2">
        <div className="row">
            <div className="col-2">
                <img src={ productPic } className="card-img" alt="Item Pic"/>
            </div>
            <div className='col-7'>
                <h5 className='m-0 text-wrap'>{ productTitle }</h5>
            </div>
            <div className='col-3 text-center m-0 price fw-bold'>€{ price }</div>
        </div>
        <div className='row mt-4'>
            <div className='col-4 d-flex justify-content-evenly'>
                <button className='rounded w-100 p-0 border-0 bg-site-primary' onClick={subOne}>-</button>
                <span className='w-100 text-center'>{quantity}</span>
                <button className='rounded w-100 p-0 border-0 bg-site-primary' onClick={addOne}>+</button>
            </div>
            <div className="col-6"></div>
            <div className='col-2'>
                <button className='w-100  bg-self-red border-0 rounded'>
                    <span className="material-icons text-black">delete</span>
                </button>
            </div>
        </div>
    </div>
    </>
  )
}

export default CartItem
