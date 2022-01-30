import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import axios from 'axios'
import Cookies from 'universal-cookie'
import '../css/Login.css'

const URL = process.env.URL || 'http://localhost:5000/'
function Login({ isLogging, setLogged }) {
  if (isLogging) {
    document.title = 'NOLONOLO Accedi'
  } else {
    document.title = 'NOLONOLO Registrati'
  }
  const navigate = useNavigate()
  const [isEmailValid, validatEmail] = useState(true)
  const [isPasswordValid, validatPassword] = useState(true)

  // verifica che i parametri email e password siano stati inseriti
  function validate(email, password) {
    validatEmail(!!email)
    validatPassword(!!password)
    if (!email) {
      document.querySelector('#email').focus()
    } else if (!password) {
      document.querySelector('#password').focus()
    }
    return isEmailValid && isPasswordValid
  }
  // invia una richiestaal server per loggare o registrare l'utente
  async function logUser(email, password) {
    const method = isLogging ? 'login' : 'register'
    const { data } = await axios({
      method: 'post',
      url: `${URL}v1/clients/${method}`,
      data: {
        email,
        password,
      },
    })
    if (data && data.accessToken && data.refreshToken && data.client) {
      const cookies = new Cookies()
      cookies.set('accessToken', data.accessToken, { path: '/' })
      cookies.set('refreshToken', data.refreshToken, { path: '/' })
      cookies.set('client', data.client, { path: '/' })
      return true
    }
    return false
  }
  async function onSubmit(event) {
    event.preventDefault()
    const email = event.target.email.value
    const password = event.target.password.value
    if (validate(email, password)) {
      const logged = await logUser(email, password)
      setLogged(logged) // conferma il login ad app.js
      navigate('/', { replace: true })
    }
  }

  return (
    <div className="container p-3">
      <div className="p-4 mt-4 md-01dp rounded">
        <form className="form" onSubmit={onSubmit}>
          <div className="mt-2 justify-content-center">
            <label htmlFor="email" className={isEmailValid ? 'form__label' : 'form__label form__label--error'}>
              E-mail
              <input
                type="text"
                name="name"
                id="email"
                className={isEmailValid ? 'form__input w-100 ' : 'form__input form__input--error w-100'}
                aria-required="true"
                aria-invalid={!isEmailValid}
                aria-describedby="mailAlert"
              />
            </label>
            {!isEmailValid && (
              <div
                role="alert"
                aria-atomic="true"
                id="mailAlert"
                className="form__alert"
              >
                Devi inserire la tua email
              </div>
            )}
          </div>
          <div className="mt-2">
            <label
              htmlFor="password"
              className={isPasswordValid ? 'form__label' : 'form__label form__label--error'}
            >
              Password
              <input
                type="password"
                name="password"
                id="password"
                className={isPasswordValid ? 'form__input w-100' : 'form__input form__input--error w-100'}
                aria-required="true"
                aria-invalid={!isPasswordValid}
                aria-describedby="passwordAlert"
              />
            </label>
            {!isPasswordValid && (
              <div
                aria-live="polite"
                role="alert"
                aria-atomic="true"
                id="passwordAlert"
                className="form__alert"
              >
                Devi inserire la tua password
              </div>
            )}
          </div>
          <button type="submit" className="form__submit mt-3 p-1 px-2 text-black">
            {isLogging ? 'Accedi' : 'Registrati'}
          </button>
        </form>
        <div className="mt-2 text-center">
          {isLogging
            ? <Link to="/register" className="text-white" title="Registrati">Non hai un account? Registrati qui</Link>
            : <Link to="/login" className="text-white" title="Accedi">Hai già un account? Accedi qui</Link>}
        </div>
      </div>
    </div>
  )
}
Login.propTypes = { isLogging: PropTypes.bool.isRequired, setLogged: PropTypes.func.isRequired }

export default Login
