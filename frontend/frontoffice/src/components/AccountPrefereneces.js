/* eslint-disable no-await-in-loop */
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import Cookies from 'universal-cookie'

import ProductCard from './ProductCard.js'

const PRODUCT_URL = process.env.PRODUCT_URL || 'https://site202156.tw.cs.unibo.it/v1/inventories'
function AccountPreferences() {
  const cookies = new Cookies()
  const client = cookies.get('client')
  const [productList, setPorductList] = useState()
  useEffect(async () => {
    const products = []
    for (let i = 0; i < client.favourites.length; i += 1) {
      const element = client.favourites[i]
      const { data } = await axios.get(`${PRODUCT_URL}/products/${element}`)
      if (data.products) products.push(data.products)
    }
    setPorductList(products)
  }, [])

  return (
    <div className="row w-100">
      <div className="col-lg-4 col-sm-1" />
      <div className="col-lg-4 col-sm-10">
        <div className="mb-4">
          <h4>Punti Fedeltà:&nbsp;
            <span>
              {client.fidelityPoints === null || client.fidelityPoints === undefined || client.fidelityPoints === 0 ? 'nessun punto' : client.fidelityPoints }
            </span>
          </h4>
        </div>
        <div className="mb-4">
          <h4>Prodotti Preferiti:</h4>
          <span>{ (productList && productList.length > 0) ? productList.map(({ id, title, price, condition, media }) => (
            <div key={id} className="col p-1">
              <ProductCard id={id} title={title} condition={condition} price={price.weekday} img={media.img} />
            </div>
          )) : 'Non hai ancora aggiunto nessun prodotto ai preferiti' }
          </span>
        </div>
      </div>
      <div className="col-lg-4 col-sm-1" />
    </div>
  )
}

export default AccountPreferences
