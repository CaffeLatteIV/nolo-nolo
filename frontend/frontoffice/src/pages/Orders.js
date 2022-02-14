/* eslint-disable react/jsx-no-bind */
/* eslint-disable dot-notation */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie'

import ActiveOrders from '../components/ActiveOrders.js'
import OlderOrders from '../components/OlderOrders.js'
import validateAccessToken from '../components/Tokens.js'

const RENTALS_URL = process.env.RENTALS_URL || 'https://site202156.tw.cs.unibo.it/v1/rentals'
function Orders() {
  const [activeOrders, setActiveOrders] = useState([])
  const [bookedOrders, setBookedOrders] = useState([])
  const [olderOrders, setOlderOrders] = useState([])
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
    if (data && data.rent) {
      data.rent.forEach((order) => {
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
      setBookedOrders(bookedOrdersList)
      setActiveOrders(activeOrdersList)
      setOlderOrders(olderOrdersList)
    }
  }, [])
  async function handleDelete(id) {
    await validateAccessToken()
    const cookie = new Cookies()
    const accessToken = cookie.get('accessToken')
    await axios.post(`${RENTALS_URL}/delete/${id}`, {}, { headers: { Authorization: `Bearer ${accessToken}` } })
    const bookedOrdersList = bookedOrders.filter((order) => order.id !== id)
    setBookedOrders(bookedOrdersList)
  }
  return (
    <div className="container p-2 mt-2">
      <div className="">
        <h1 className="p-2">I miei ordini</h1>
        <div className="p-2">
          <div className="p-3 px-4 md-04dp rounded">
            <h2>In uso ora</h2>
            {
              (!activeOrders || activeOrders.length === 0) ? <p>Nessun prodotto</p>
                : activeOrders.map(
                  ({ id, title, start, end, price, media, fidelityPoints, productCode }) => (
                    <ActiveOrders
                      key={id}
                      productCode={productCode}
                      id={id}
                      title={title}
                      price={price}
                      start={start}
                      img={media.img}
                      end={end}
                      points={fidelityPoints}
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
              (!bookedOrders || bookedOrders.length === 0) ? <p>Nessun prodotto</p>
                : bookedOrders.map(
                  ({ id, title, start, end, price, media, fidelityPoints, productCode }) => (
                    <ActiveOrders
                      key={id}
                      productCode={productCode}
                      id={id}
                      title={title}
                      price={price}
                      img={media.img}
                      start={start}
                      end={end}
                      fidelityPoints={fidelityPoints}
                      handleDelete={handleDelete}
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
              (!olderOrders || olderOrders.length === 0) ? <p>Nessun prodotto</p> : olderOrders.map(
                ({ id, title, start, end, media, price, fidelityPoints, status, productCode }) => (
                  <OlderOrders
                    key={id}
                    id={id}
                    productCode={productCode}
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
