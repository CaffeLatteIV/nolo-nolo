import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function Navbar () {
  const [isLogged] = useState(false)
  return (
        <div>
        {/* Main navbar */}
        <nav className="navbar navbar-expand md-04dp">
            <div className="container-fluid">
                <Link to='/' className="navbar-brand text-white" title="Menù principale">
                    NOLONOLO
                </Link>
                <button className="navbar-toggler"type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            {isLogged
                              ? <Link to='/login' className="nav-link" title="Account">
                                    <span className="material-icons text-white">person</span>
                                </Link>
                              : <Link to='/login' className="nav-link" title="Account">
                                    <span className="material-icons text-white">person_outline</span>
                                </Link>
                            }
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
