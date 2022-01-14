import React from 'react'
import Cookies from 'universal-cookie'

function Account() {
  const cookies = new Cookies()
  const client = cookies.get('client')
  return (
    <div className="container p-2">
      <div className="md-04dp mt-3 p-2 rounded">
        <div className="p-2">
          <h1>Il mio account</h1>
          <h4 className="mt-4 mb-0">Email:</h4>
          <span> { client.email } </span>
          <h4 className="mt-4 mb-0">Categorie Preferite:</h4>
          <span> { client.preferredCategories } </span>
          <h4 className="mt-4 mb-0">Punti fedeltà:</h4>
          <span> { client.fidelityPoints } </span>
          <h4 className="mt-4 mb-0">Prodotti preferiti:</h4>
          <span> { client.favourites } </span>
        </div>
      </div>
    </div>
  )
}

export default Account
