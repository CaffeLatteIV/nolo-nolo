import React, { useState } from 'react'
import ActiveOrders from '../components/ActiveOrders'
import BookedOrders from '../components/BookedOrders'

function Orders () {
  const arrayOfProducts = useState(
    {
      id: 0,
      name: 'Prodotto',
      price: 9.99
    }
  )
  return (
    <div className="container p-2 mt-2">
        <div className="">
            <div className='p-2'>
                <div className='p-3 px-4 md-04dp rounded'>
                    <h2>In uso ora</h2>
                    <ActiveOrders name={arrayOfProducts[0].name} price={arrayOfProducts[0].price}/>
                    <ActiveOrders name={arrayOfProducts[0].name} price={arrayOfProducts[0].price}/>
                </div>
            </div>
            <div className='p-2'>
                <div className='p-3 px-4 md-04dp rounded'>
                    <h2>Prenotati</h2>
                    <BookedOrders name={arrayOfProducts[0].name} price={arrayOfProducts[0].price}/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Orders
