import React from 'react'

function Categories () {
  return (
        <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className="container-fluid">
                <button className="navbar-toggler" type="button" data-bs-target="#catNav" aria-controls="catNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="catNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link active" href="#">Categoria1</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active" href="#">Cat2</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active" href="#">Cat3</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active" href="#">Cat4</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active" href="#">Cat5</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active" href="#">Cat6</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active" href="#">Cat7</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active" href="#">Cat8</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active" href="#">Cat9</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
  )
}

export default Categories
