import React from 'react'

function Navbar () {
  return (
        <div>
        {/* Main navbar */}
        <nav className="navbar navbar-expand md-04dp">
            <div className="container-fluid">
                <a className="navbar-brand text-white" title="Menù principale" href="#">
                    NOLONOLO
                </a>
                <button className="navbar-toggler"type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <a className="nav-link" title="Accedi o Registrati" href="#">
                                <span className="material-icons text-white">person_outline</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" title="Carrello" href="#">
                                <span className="material-icons text-white">shopping_cart</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        </div>
  )
}

export default Navbar
