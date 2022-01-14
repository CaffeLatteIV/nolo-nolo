import React from 'react'
import Cookies from 'universal-cookie'
import CartItem from '../components/CartItem.js'

function Cart() {
  document.title = 'NOLONOLO Carello'
  const cookies = new Cookies()
  const cartList = cookies.get('/cart')
  return (
    <div className="container p-2 mt-2">
      <div className="p-2 md-04dp rounded">
        {
          cartList ? cartList.map(({ name, price }) => <CartItem name={name} price={price} />) : 'Vuoto'
        }

      </div>
      <div className="p-2 d-flex justify-content-center">
        <button type="submit" className="w-auto rounded p-2 mt-4 fs-4 border-0 bg-site-primary">Noleggia subito</button>
      </div>
    </div>
  )
}

export default Cart
