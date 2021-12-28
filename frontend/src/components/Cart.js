import React from 'react'
import CartItem from './CartItem'

function Cart () {
  return (
    <>
    <div className='container p-2 mt-2'>
      <div className="p-2 md-04dp rounded">
        <CartItem />
      </div>
      <div className='p-2'>
        <button className='w-100 rounded p-2 mt-4 fs-4 border-0 bg-site-primary'>Noleggia subito</button>
      </div>
    </div>
    </>
  )
}

export default Cart
