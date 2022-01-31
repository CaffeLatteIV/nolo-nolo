import React, { useState } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

const URL = process.env.URL || 'http://localhost:5000/'

function Login({ setLogged }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  // invia una richiestaal server per loggare o registrare l'utente
  async function logUser() {
    const { data } = await axios({
      method: 'post',
      url: `${URL}v1/clients/login`,
      data: {
        email,
        password,
      },
    })
    if (data && data.accessToken && data.refreshToken && data.client) {
      const cookies = new Cookies()
      cookies.set('accessToken', data.accessToken, { path: '/', sameSite: 'Lax' })
      cookies.set('refreshToken', data.refreshToken, { path: '/', sameSite: 'Lax' })
      cookies.set('client', data.client, { path: '/', sameSite: 'Lax' })
      return true
    }
    return false
  }
  async function handleClick() {
    const logged = await logUser(email, password)
    setLogged(logged)
    navigate('/', { replace: true })
  }
  return (
    <div className="w-50 m-auto" id="accountInfo">
      <div className="mb-4">
        <label className="form-label mb-4" htmlFor="emailInput">
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="emailInput"
            className="form-control text-white"
            value={email}
          />Email
        </label>
        <br />
        <label className="form-label  mb-4" htmlFor="passwordInput">
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            id="passwordInput"
            className="form-control text-white"
            value={password}
          />Password
        </label>
      </div>
      <button type="submit" onClick={handleClick} className="btn btn-primary mb-4 text-black">
        Accedi
      </button>
    </div>
  )
}
// eslint-disable-next-line react/no-unused-prop-types
Login.propTypes = { setLogged: PropTypes.func.isRequired }
export default Login
