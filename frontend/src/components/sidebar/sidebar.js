import React from 'react'

import './sidebar.css'

function Sidebar() {
  return (
    <>
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" /> cccc
        </button>
      </div>
      <nav className="navbar bg-light">
        <div className="collapse" id="navbarToggleExternalContent">
          <ul>
            <li className=""><a href="#test" className="nav-item text-decoration-none tex " aria-current="true">Inventario</a></li>
            <li className=""><a href="#test" className="nav-item text-decoration-none tex">Ordini</a></li>
            <li className=""><a href="#test" className="nav-item text-decoration-none tex">Clienti</a></li>
            <li className=""><a href="#test" className="nav-item text-decoration-none tex">Dipendenti</a></li>
          </ul>
        </div>
      </nav>
    </>
  )
}
export default Sidebar
