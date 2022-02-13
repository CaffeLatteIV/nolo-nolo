/* eslint-disable react/jsx-no-bind */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const URL = process.env.TOKEN_URL || 'https://site202156.tw.cs.unibo.it/v1/token'
function Navbar({ updateLogged }) {
  const cookies = new Cookies()
  const [logged, setLogged] = useState(cookies.get('client') !== undefined)
  const [admin, setAdmin] = useState(true)
  const [manager, setManager] = useState(true)
  useEffect(() => {
    const client = cookies.get('client')
    setLogged(client !== undefined || updateLogged)
    if (client?.role === 'funzionario') {
      setAdmin(true)
    } else if (client?.role === 'manager') {
      setAdmin(true)
      setManager(true)
    } else {
      setAdmin(false)
    }
  }, [updateLogged])
  async function logout() {
    // const cookies = new Cookies()
    const refreshToken = cookies.get('refreshToken')
    if (refreshToken) {
      await axios.delete(`${URL}/remove`, { data: { refreshToken } })
    }
    cookies.remove('client')
    cookies.remove('refreshToken')
    cookies.remove('accessToken')
    setLogged(false)
    setAdmin(false)
  }
  return (
    <div>
      {/* Main navbar */}
      <nav className="navbar navbar-expand-lg md-04dp">
        <div className="container-fluid">
          <Link
            to="/"
            className="navbar-brand text-white"
            title="Menù principale"
          >
            <h2>NOLONOLO</h2>
          </Link>
          <button
            className="navbar-toggler bg-site-primary"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarText"
            aria-controls="navbarText"
            aria-expanded="false"
            aria-label="Apri pannello di navigazione"
          >
            <span className="material-icons">menu</span>
          </button>
          {logged && admin ? (
            <div className="collapse navbar-collapse" id="navbarText">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <a className="nav-link text-white" href="http://localhost:3000/">Store</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="http://localhost:8080/admin/clientList">Clienti</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="http://localhost:8080/admin/inventory">Inventario</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="http://localhost:8080/admin/noleggi">Noleggi</a>
                </li>
                { logged && manager ? (
                  <li className="nav-item dropdown">
                    <a
                      href="#"
                      className="nav-link dropdown-toggle text-white"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Statistiche
                    </a>
                    <ul
                      className="dropdown-menu rounded m-0 border-0 md-base p-0"
                      aria-labelledby="navbarDropdown"
                    >
                      <li className="p-2 nav-item md-12dp rounded-top">
                        <a
                          className="nav-link text-white"
                          href="http://localhost:5500/frontend/dashboard/HTML/clientStats.html"
                        >Clienti
                        </a>
                      </li>
                      <li className="p-2 nav-item md-12dp rounded-bottom">
                        <a
                          className="nav-link text-white"
                          href="http://localhost:5500/frontend/dashboard/HTML/index.html"
                        >Oggetti
                        </a>
                      </li>
                    </ul>
                  </li>
                ) : '' }
              </ul>
            </div>
          ) : '' }

          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item dropstart">
                {(logged && !admin) ? (
                  <>
                    <a
                      href="#"
                      className="nav-link dropstart-toggle"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      title="Account"
                    >
                      <span className="material-icons text-white">person</span>
                    </a>
                    <ul
                      className="dropdown-menu rounded m-0 border-0 md-base p-0"
                      aria-labelledby="navbarDropdown"
                    >
                      <li className="md-24dp rounded-top">
                        <Link
                          to="/account"
                          className="nav-link text-white px-4"
                          title="Il mio account"
                        >
                          Il mio account
                        </Link>
                      </li>
                      <li className="md-24dp">
                        <Link
                          to="/orders"
                          className="nav-link text-white px-4"
                          title="I miei ordini"
                        >
                          I miei ordini
                        </Link>
                      </li>
                      <li className="p-2 md-24dp rounded-bottom">
                        <Link
                          className="dropdown-item md-error rounded text-white"
                          id="logout"
                          to="/"
                          onClick={logout}
                        >
                          Esci
                        </Link>
                      </li>
                    </ul>
                  </>
                ) : ''}
                { (!logged && !admin) ? (
                  <>
                    <a
                      className="nav-link dropstart-toggle"
                      href="#"
                      role="button"
                      id="navbarDarkDropdownMenuLink"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <span className="material-icons text-white">
                        person_outline
                      </span>
                    </a>

                    <ul
                      className="dropdown-menu rounded m-0 border-0 md-base p-0"
                      aria-labelledby="navbarDarkDropdownMenuLink"
                    >
                      <li className="p-2 nav-item md-12dp rounded-top">
                        <Link
                          to="/login"
                          className="nav-link text-white px-4"
                          title="Accedi"
                        >
                          Accedi
                        </Link>
                      </li>
                      <li className="p-2 nav-item md-12dp rounded-bottom">
                        <Link
                          to="/register"
                          className="nav-link text-white px-4"
                          title="Registrati"
                        >
                          Registrati
                        </Link>
                      </li>
                    </ul>
                  </>
                ) : ''}
              </li>
              {(admin && logged) ? (
                <div className="collapse navbar-collapse" id="navbarText">
                  <ul className="navbar-nav ms-auto">
                    <li className="nav-item dropstart">
                      <a
                        href="#"
                        className="nav-link dropstart-toggle"
                        id="navbarDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        title="Account"
                      >
                        <span className="material-icons text-white">person</span>
                      </a>
                      <ul className="dropdown-menu rounded m-0 border-0 md-base p-0" aria-labelledby="navbarDropdown">
                        <li className="p-2 rounded md-24dp">
                          <Link className="dropdown-item md-error rounded text-white" id="logout" to="/" onClick={logout}>Esci</Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              ) : ''}
              {/* <li className="nav-item">
                <Link to="/cart" className="nav-link" title="Carrello">
                  <span className="material-icons text-white">shopping_cart</span>
                </Link>
              </li> */}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}
Navbar.propTypes = { updateLogged: PropTypes.bool.isRequired }

export default Navbar
