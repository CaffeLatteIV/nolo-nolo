import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import Cookies from 'universal-cookie'
import validateAccessToken from './Tokens.js'

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5000/v1/clients'
function Favourites(title, clientCode) {
  function handleClick() {
    validateAccessToken()
    const cookie = new Cookies()
    const accessToken = cookie.get('accessToken')
    axios.post(`${CLIENT_URL}/update`, { title, clientCode }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
  }
  return <button onClick={handleClick} type="button">Salva</button>
}
Favourites.propTypes = {
  title: PropTypes.string.isRequired,
  clientCode: PropTypes.string.isRequired,
}
export default Favourites
