import React from 'react'

function Categories () {
    return (
        <nav class="navbar navbar-expand navbar-dark bg-dark">
            <div class="container-fluid">
                <button class="navbar-toggler" type="button" data-bs-target="#catNav" aria-controls="catNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="catNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link active" href="#">Categoria1</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link active" href="#">Cat2</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link active" href="#">Cat3</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link active" href="#">Cat4</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link active" href="#">Cat5</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link active" href="#">Cat6</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link active" href="#">Cat7</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link active" href="#">Cat8</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link active" href="#">Cat9</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Categories