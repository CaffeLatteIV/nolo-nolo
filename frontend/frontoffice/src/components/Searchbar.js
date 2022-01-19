import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Searchbar() {
  const [searchText, setSearchText] = useState('')
  const navigate = useNavigate()
  function search(event) {
    event.preventDefault()
    navigate('/search', { state: { searchText } })
  }
  return (
    <div>
      <div className="container-fluid w-100 md-04dp">
        <form className="d-flex" onSubmit={search}>
          <input className="form-control me-1 bg-transparent text-white" type="search" placeholder="Cerca.." aria-label="Cerca" value={searchText} onInput={(e) => setSearchText(e.target.value)} />
          <button className="btn text-black bg-site-primary" type="submit">Cerca</button>
        </form>
      </div>
    </div>
  )
}

export default Searchbar
