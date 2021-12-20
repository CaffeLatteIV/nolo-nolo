import React from 'react'

function Searchbar () {
  return (
        <div>
            <div className="container-fluid w-100 bg-dark">
                <form className="d-flex ">
                    <input className="form-control me-1" type="search" placeholder="Search.." aria-label="Search"/>
                    <button className="btn btn-outline-success" type="submit">Search</button>
                </form>
            </div>
        </div>
  )
}

export default Searchbar
