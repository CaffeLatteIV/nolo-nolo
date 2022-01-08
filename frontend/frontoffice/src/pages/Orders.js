/* eslint-disable dot-notation */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie'
import ActiveOrders from '../components/ActiveOrders.js'
import BookedOrders from '../components/BookedOrders.js'
import validateAccessToken from '../components/Tokens.js'

const URL = process.env.ORDERS_URL || 'http://localhost:5000/v1/rentals'
function Orders() {
  // const [activeOrdersList, setActiveOrdersList] = useState(undefined)
  const arrayOfProducts = useState(
    {
      id: 0,
      name: 'Prodotto',
      price: 9.99,
    },
  )
  useEffect(async () => {
    await validateAccessToken()
    const cookie = new Cookies()
    const accessToken = cookie.get('accessToken')
    const id = cookie.get('client')['_id']
    const { data } = await axios({
      method: 'GET',
      url: `${URL}/clients/${id}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    data.forEach((order) => {
      const today = Date.now()
      const { start } = order
      console.log(start)
      console.log(today)
    })
    console.log(data)
  }, [])
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
