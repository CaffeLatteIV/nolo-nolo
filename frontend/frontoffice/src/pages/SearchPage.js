import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard.js'

const URL = process.env.OPERATIONS_URL || 'http://localhost:5000/v1/operations'
function SearchPage() {
  const [products, setProducts] = useState(undefined)
  const { state } = useLocation()
  // viene eseguito una volta sola (alla prima visita della pagina)
  const { searchText } = state
  // se il parametro id non è presente restituisce la pagina 404
  if (searchText === null) {
    const navigate = useNavigate()
    navigate('*')
  }
  useEffect(async () => {
    const { data } = await axios({
      method: 'GET',
      url: `${URL}/search/${searchText}`,
    })
    setProducts(data.result)
  }, [])

  document.title = 'NOLONOLO'
  return (
    <div className="container p-2">
      <div className="container-fluid row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 row-cols-xxl-6 p-0 m-0" id="card-container">
        { products ? products.map(({ id, title, price, condition, media }) => (
          <div key={id} className="col p-1">
            <ProductCard id={id} title={title} condition={condition} price={price.weekday} img={media.img} />
          </div>
        )) : 'caricamento...'}
      </div>
    </div>

  )
}

export default SearchPage
