import React from 'react'

function Searchbar() {
  return (
    <div>
      <div className="container-fluid w-100 md-04dp">
        <form className="d-flex">
          <input className="form-control me-1 bg-transparent" type="search" placeholder="Cerca.." aria-label="Cerca" />
          <button className="btn text-black bg-site-primary" type="submit">Cerca</button>
        </form>
      </div>
    </div>
  )
}

export default Searchbar
