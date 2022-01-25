import React from 'react'

import Cookies from 'universal-cookie'

function AccountPreferences() {
  const cookies = new Cookies()
  const client = cookies.get('client')
  console.log(client.preferredCategories)
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
        <span>{ client.favourites.length !== 0 ? client.favourites : 'Non hai ancora aggiunto nessun prodotto ai preferiti' }</span>
      </div>
    </div>
  )
}

export default AccountPreferences
