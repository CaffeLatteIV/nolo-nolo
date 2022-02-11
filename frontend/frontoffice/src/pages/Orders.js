/* eslint-disable dot-notation */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie'

import ActiveOrders from '../components/ActiveOrders.js'
import BookedOrders from '../components/BookedOrders.js'
import validateAccessToken from '../components/Tokens.js'

const RENTALS_URL = process.env.RENTALS_URL || 'https://site202156.tw.cs.unibo.it/v1/rentals'
function Orders() {
  const [productList, setProductList] = useState({ bookedOrders: [], activeOrders: [], olderOrders: [] })
  useEffect(async () => {
    await validateAccessToken()
    const cookie = new Cookies()
    const accessToken = cookie.get('accessToken')
    const { id } = cookie.get('client')
    const { data } = await axios({
      method: 'GET',
      url: `${RENTALS_URL}/clients/${id}`,
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
      if (today > end) {
        olderOrdersList.push(order)
      } else if (today < start) {
        bookedOrdersList.push(order)
      } else {
        activeOrdersList.push(order)
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
        <h1 className="p-2">I miei ordini</h1>
        <div className="p-2">
          <div className="p-3 px-4 md-04dp rounded">
            <h2>In uso ora</h2>
            {
              (!productList.activeOrders || productList.activeOrders.length === 0) ? <p>Nessun prodotto</p>
                : productList.activeOrders.map(
                  ({ id, title, start, end, price, media, fidelityPoints, status, productCode }) => (
                    <ActiveOrders
                      key={id}
                      id={productCode}
                      title={title}
                      price={price}
                      start={start}
                      img={media.img}
                      end={end}
                      fidelityPoints={fidelityPoints}
                      paid={status === 'Pagato'}
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
                  ({ id, title, start, end, price, media, status, fidelityPoints, productCode }) => (
                    <BookedOrders
                      key={id}
                      id={productCode}
                      title={title}
                      price={price}
                      img={media.img}
                      start={start}
                      end={end}
                      fidelityPoints={fidelityPoints}
                      paid={status === 'Pagato'}
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
                ({ id, title, start, end, media, price, fidelityPoints, status, productCode }) => (
                  <BookedOrders
                    key={id}
                    id={productCode}
                    img={media.img}
                    title={title}
                    price={price}
                    start={start}
                    end={end}
                    fidelityPoints={fidelityPoints}
                    paid={status === 'Pagato'}
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
