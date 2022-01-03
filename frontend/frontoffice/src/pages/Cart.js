import React, { useState } from 'react'
import CartItem from '../components/CartItem'

function Cart () {
  document.title = 'NOLONOLO Carello'
  const arrayOfProducts = useState(
    {
      id: 0,
      name: 'Prodotto',
      price: 9.99
    }
  )
  return (
    <>
    <div className='container p-2 mt-2'>
      <div className="p-2 md-04dp rounded">
        <CartItem name={arrayOfProducts[0].name} price={arrayOfProducts[0].price} />
      </div>
      <div className='p-2 d-flex justify-content-center'>
        <button className='w-auto rounded p-2 mt-4 fs-4 border-0 bg-site-primary'>Noleggia subito</button>
      </div>
    </div>
    </>
  )
}

export default Cart
