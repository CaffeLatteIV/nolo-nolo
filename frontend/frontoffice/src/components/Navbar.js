/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function Navbar () {
  const [isLogged] = useState(true)
  return (
        <div>
        {/* Main navbar */}
        <nav className="navbar navbar-expand md-04dp">
            <div className="container-fluid">
                <Link to='/' className="navbar-brand text-white" title="Menù principale">
                    NOLONOLO
                </Link>
                <button className="navbar-toggler"type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Apri pannello di navigazione">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item dropstart">
                            {isLogged
                              ? <>
                                    <button className="btn dropdown-toggle" type="button" id="navbarDarkDropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                                        <span className="material-icons text-white">person</span>
                                    </button>

                                    <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDarkDropdownMenuLink">
                                        <li>
                                            <Link to='/account' className="nav-link text-white px-4" title="Il mio account">
                                                Il mio account
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to='/orders' className="nav-link text-white px-4" title="I miei ordini">
                                                I miei ordini
                                            </Link>
                                        </li>
                                    </ul>
                                </>

                              : <>
                                    <a className="btn dropdown-toggle" href="#" role="button" id="navbarDarkDropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                                        <span className="material-icons text-white">person_outline</span>
                                    </a>

                                    <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDarkDropdownMenuLink">
                                        <li>
                                            <Link to='/login' className="nav-link text-white px-4" title="Accedi">
                                                Accedi
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to='/register' className="nav-link text-white px-4" title="Registrati">
                                                Registrati
                                            </Link>
                                        </li>
                                    </ul>
                                </>
                            }
                              {/* <Link to='/login' className="nav-link" title="Account">
                                    <span className="material-icons text-white">person</span>
                                </Link>
                              : <Link to='/login' className="nav-link" title="Account">
                                    <span className="material-icons text-white">person_outline</span>
                            </Link> */}

                        </li>
                        <li className="nav-item">
                            <Link to='/cart' className="nav-link" title="Carrello">
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
