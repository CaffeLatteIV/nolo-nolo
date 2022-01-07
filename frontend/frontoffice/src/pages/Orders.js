import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie'
import ActiveOrders from '../components/ActiveOrders.js'
import BookedOrders from '../components/BookedOrders.js'

const URL = process.env.ORDERS_URL || 'http://localhost:5000/v1/rentals'
function Orders() {
  useEffect(async () => {
    const cookies = new Cookies()
    const accessToken = cookies.get('accessToken')
    const clientCode = cookies.get('client')
    const { data } = await axios({
      method: 'GET',
      url: `${URL}/clients/${clientCode}`,
      headers: {
        Authorization: `Berarer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    console.log(data)
  }, [])
  const arrayOfProducts = useState(
    {
      id: 0,
      name: 'Prodotto',
      price: 9.99,
    },
  )
  return (
    <div className="container p-2 mt-2">
      <div className="">
        <div className="p-2">
          <div className="p-3 px-4 md-04dp rounded">
            <h2>In uso ora</h2>
            <ActiveOrders name={arrayOfProducts[0].name} price={arrayOfProducts[0].price} />
            <ActiveOrders name={arrayOfProducts[0].name} price={arrayOfProducts[0].price} />
          </div>
        </div>
        <div className="p-2">
          <div className="p-3 px-4 md-04dp rounded">
            <h2>Prenotati</h2>
            <BookedOrders name={arrayOfProducts[0].name} price={arrayOfProducts[0].price} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Orders
