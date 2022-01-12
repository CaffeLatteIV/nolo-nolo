/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  const [isLogged] = useState(true)
  return (
    <div>
      {/* Main navbar */}
      <nav className="navbar navbar-expand md-04dp">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand text-white" title="Menù principale">
            NOLONOLO
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Apri pannello di navigazione">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item dropstart">
                {isLogged
                  ? (
                    <>
                      <a href="#" className="nav-link dropstart-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" title="Account">
                        <span className="material-icons text-white">person</span>
                      </a>
                      <ul className="dropdown-menu rounded m-0 border-0 md-base p-0" aria-labelledby="navbarDropdown">
                        <li className="md-24dp rounded-top">
                          <Link to="/account" className="nav-link text-white px-4" title="Il mio account">
                            Il mio account
                          </Link>
                        </li>
                        <li className="md-24dp">
                          <Link to="/orders" className="nav-link text-white px-4" title="I miei ordini">
                            I miei ordini
                          </Link>
                        </li>
                        <li className="p-2 md-24dp rounded-bottom">
                          <a className="dropdown-item md-error rounded text-white" id="logout" href="#">Esci</a>
                        </li>
                      </ul>
                    </>
                  )

                  : (
                    <>
                      <a className="btn dropdown-toggle" href="#" role="button" id="navbarDarkDropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                        <span className="material-icons text-white">person_outline</span>
                      </a>

                      <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDarkDropdownMenuLink">
                        <li>
                          <Link to="/login" className="nav-link text-white px-4" title="Accedi">
                            Accedi
                          </Link>
                        </li>
                        <li>
                          <Link to="/register" className="nav-link text-white px-4" title="Registrati">
                            Registrati
                          </Link>
                        </li>
                      </ul>
                    </>
                  )}
              </li>
              <li className="nav-item">
                <Link to="/cart" className="nav-link" title="Carrello">
                  <span className="material-icons text-white">shopping_cart</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
