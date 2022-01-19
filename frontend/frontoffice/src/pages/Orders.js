/* eslint-disable dot-notation */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie'
import ActiveOrders from '../components/ActiveOrders.js'
import BookedOrders from '../components/BookedOrders.js'
import validateAccessToken from '../components/Tokens.js'

const URL = process.env.ORDERS_URL || 'http://localhost:5000/v1/rentals'
function Orders() {
  const [productList, setProductList] = useState({ bookedOrders: [], activeOrders: [], olderOrders: [] })
  useEffect(async () => {
    await validateAccessToken()
    const cookie = new Cookies()
    const accessToken = cookie.get('accessToken')
    const { id } = cookie.get('client')
    const { data } = await axios({
      method: 'GET',
      url: `${URL}/clients/${id}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    const bookedOrdersList = []
    const activeOrdersList = []
    const olderOrdersList = []
    data.forEach((order) => {
      const today = Date.now()
      const { end, start } = order
      if (today >= start && today <= end) {
        activeOrdersList.push(order)
      } else if (today < start) {
        bookedOrdersList.push(order)
      } else {
        olderOrdersList.push(order)
      }
    })
    setProductList({
      bookedOrders: bookedOrdersList,
      activeOrders: activeOrdersList,
      olderOrders: olderOrdersList,
    })
  }, [])
  return (
    <div className="container p-2 mt-2">
      <div className="">
        <div className="p-2">
          <div className="p-3 px-4 md-04dp rounded">
            <h2>In uso ora</h2>
            {
              (!productList.activeOrders || productList.activeOrders.length === 0) ? <p>Nessun prodotto</p>
                : productList.activeOrders.map(
                  ({ title, start, end, price, fidelityPoints, paid, productCode }) => (
                    <ActiveOrders
                      id={productCode}
                      title={title}
                      price={price}
                      start={start}
                      end={end}
                      fidelityPoints={fidelityPoints}
                      paid={paid}
                    />
                  ),
                )
            }
          </div>
        </div>
        <div className="p-2">
          <div className="p-3 px-4 md-04dp rounded">
            <h2>Prenotati</h2>
            {
              (!productList.bookedOrders || productList.bookedOrders.length === 0) ? <p>Nessun prodotto</p>
                : productList.bookedOrders.map(
                  ({ title, start, end, price, fidelityPoints, paid, productCode }) => (
                    <BookedOrders
                      id={productCode}
                      title={title}
                      price={price}
                      start={start}
                      end={end}
                      fidelityPoints={fidelityPoints}
                      paid={paid}
                    />
                  ),
                )
            }
          </div>
        </div>
        <div className="p-2">
          <div className="p-3 px-4 md-04dp rounded">
            <h2>Vecchi ordini</h2>
            {
              (!productList.olderOrders || productList.olderOrders.length === 0) ? <p>Nessun prodotto</p> : productList.olderOrders.map(
                ({ title, start, end, price, fidelityPoints, paid, productCode }) => (
                  <BookedOrders
                    id={productCode}
                    title={title}
                    price={price}
                    start={start}
                    end={end}
                    fidelityPoints={fidelityPoints}
                    paid={paid}
                  />
                ),
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Orders
