import React from 'react'

function Navbar () {
  return (
        <div>
        {/* Main navbar */}
        <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className="container-fluid">
                {/* Logo */}
                <a className="navbar-brand" href="#">
                    NOLONOLO
                </a>
                <button className="navbar-toggler"type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                <span className="material-icons" style="color: white;">person_outline</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                <span className="material-icons" style="color: white;">shopping_cart</span>
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
