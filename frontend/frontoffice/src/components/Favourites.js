import React, { useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import Cookies from 'universal-cookie'

import validateAccessToken from './Tokens.js'

const CLIENT_URL = process.env.CLIENT_URL || `${global.baseURL}/clients`
function Favourites({ id }) {
  const cookie = new Cookies()
  const accessToken = cookie.get('accessToken')
  const cookies = new Cookies()
  const client = cookies.get('client')
  const [isFavourite, setIsFavourite] = useState(client.favourites.includes(id))
  async function handleClick() {
    await validateAccessToken()
    const { favourites } = client
    if (isFavourite) {
      favourites.splice(favourites.indexOf(id), 1)
      setIsFavourite(false)
    } else {
      favourites.push(id)
      setIsFavourite(true)
    }

    client.favourites = favourites
    cookies.remove('client', { path: '/' })
    cookies.set('client', client, { path: '/', sameSite: 'lax' })
    await axios.post(`${CLIENT_URL}/update/preferences`, { client }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
  }
  return (
    <div className="col-2 ps-0 pe-1 d-flex flex-column justify-content-center">
      <button className="md-08dp w-100 rounded p-0 m-0 border-0 text-white text-center" onClick={handleClick} type="button">
        { !isFavourite
          ? <span className="material-icons p-1">star_outline</span>
          : <span className="material-icons  p-1 text-warning">star</span>}
      </button>
    </div>
  )
}
Favourites.propTypes = {
  id: PropTypes.string.isRequired,
}
export default Favourites
