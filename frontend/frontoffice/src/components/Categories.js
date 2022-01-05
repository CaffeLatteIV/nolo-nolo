/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react'
import axios from 'axios'

const URL = process.env.INVENTORY_URL || 'http://localhost:5000/v1/inventories'

function Categories() {
  const [categories, setCategories] = useState(undefined)
  // viene eseguito una volta sola (alla prima visita della pagina)
  useEffect(async () => {
    const { data } = await axios({
      method: 'GET',
      url: `${URL}/categories`,
    })
    setCategories(data.categories)
  }, [])
  return (
    <nav className="navbar navbar-expand md-04dp">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-target="#catNav" aria-controls="catNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="catNav">
          <ul className="navbar-nav">
            {categories ? categories.map(({ _id, category }) => (
              <li key={_id} className="nav-item">
                <a className="nav-link active text-white" title={category} href="#">{category}</a>
              </li>
            )) : ''}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Categories
