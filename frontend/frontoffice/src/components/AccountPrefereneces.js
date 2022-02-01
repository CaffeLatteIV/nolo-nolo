/* eslint-disable no-await-in-loop */
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import Cookies from 'universal-cookie'
import ProductCard from './ProductCard.js'

const PRODUCT_URL = process.env.PRODUCT_URL || 'http://localhost:5000/v1/inventories'
function AccountPreferences() {
  const cookies = new Cookies()
  const client = cookies.get('client')
  const [productList, setPorductList] = useState()
  useEffect(async () => {
    const products = []
    for (let i = 0; i < client.favourites.length; i += 1) {
      const element = client.favourites[i]
      const { data } = await axios.get(`${PRODUCT_URL}/products/${element}`)
      products.push(data.products)
    }
    setPorductList(products)
  }, [])

  return (
    <div className="w-50 m-auto">
      <div className="mb-4">
        <h4>Punti Fedeltà:<span> {client.fidelityPoints}</span></h4>
      </div>
      <div className="mb-4">
        <h4>Categorie Preferite:</h4>
        <span>{ client.preferredCategories.length !== 0 ? client.preferredCategories : 'Non hai ancora aggiunto nessuna categoria ai preferiti' }</span>
      </div>
      <div className="mb-4">
        <h4>Prodotti Preferiti:</h4>
        <span>{ productList ? productList.map(({ id, title, price, condition, media }) => (
          <div key={id} className="col p-1">
            <ProductCard id={id} title={title} condition={condition} price={price.weekday} img={media.img} />
          </div>
        )) : 'Non hai ancora aggiunto nessun prodotto ai preferiti' }
        </span>
      </div>
    </div>
  )
}

export default AccountPreferences