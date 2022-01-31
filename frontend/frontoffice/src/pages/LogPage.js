import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import Register from '../components/Register.js'
import Login from '../components/Login.js'

import '../css/Login.css'

function LogPage({ isLogging, setLogged }) {
  if (isLogging) {
    document.title = 'NOLONOLO Accedi'
  } else {
    document.title = 'NOLONOLO Registrati'
  }
  return (
    <div className="container p-3">
      <div className="p-4 mt-4 md-01dp rounded">
        <h1 className="text-center mb-4">{isLogging ? 'Accedi' : 'Registrati'}</h1>
        <div className="form" id="accountInfo">
          {isLogging ? <Login setLogged={(logged) => setLogged(logged)} /> : <Register setLogged={(logged) => setLogged(logged)} />}
        </div>
        <div className="mt-2 text-center">
          {isLogging
            ? <Link to="/register" className="text-white" title="Registrati">Non hai un account? Registrati qui</Link>
            : <Link to="/login" className="text-white" title="Accedi">Hai già un account? Accedi qui</Link>}
        </div>
      </div>
    </div>
  )
}
LogPage.propTypes = { isLogging: PropTypes.bool.isRequired, setLogged: PropTypes.func.isRequired }

export default LogPage
