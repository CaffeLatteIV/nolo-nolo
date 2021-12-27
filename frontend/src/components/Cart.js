import React from 'react'
import CartItem from './CartItem'

function Cart () {
  return (
    <>
        <div className='container p-2 mt-2'>
            <div className="p-2 md-04dp rounded">
                <CartItem />
            </div>
        </div>
    </>
  )
}

export default Cart
