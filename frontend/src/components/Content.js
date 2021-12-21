import React, { useState, useEffect } from 'react'

import ProductCard from './ProductCard'

function Content () {
  const [carouselItems, setCarouselItems] = useState([
    {
      id: 0,
      title: 'Cuffie',
      price: 90
    },
    {
      id: 1,
      title: 'Caricatore',
      price: 25
    },
    {
      id: 2,
      title: 'Cassa',
      price: 70
    }
  ])
  useEffect(() => {
    setCarouselItems([
      {
        id: 0,
        title: 'Cuffie',
        price: 90
      },
      {
        id: 1,
        title: 'Caricatore',
        price: 25
      },
      {
        id: 2,
        title: 'Cassa',
        price: 70
      }
    ])
  })
  return (
    <div className="container p-2">
        {/* Carousel */}
        <div id="carouselDark" className="carousel carousel-dark slide p-0 mb-0" data-bs-ride="carousel">
            <div className="carousel-indicators">
            <button type="button" data-bs-target="#carouselDark" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselDark" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselDark" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
            <div className="carousel-inner">
                <div className="carousel-item active" data-bs-interval="4000">
                    <img src="" className="d-block w-100" alt="First Item"/>
                    <div className="carousel-caption">
                        <h5>{ carouselItems[0].title }</h5>
                        <p>Price: ${ carouselItems[0].price }/month</p>
                    </div>
                </div>
                <div className="carousel-item" data-bs-interval="3000">
                    <img src="" className="d-block w-100" alt="Second Item"/>
                    <div className="carousel-caption">
                        <h5>{ carouselItems[1].title }</h5>
                        <p>Price: ${ carouselItems[1].price }/month</p>

                    </div>
                </div>
                <div className="carousel-item" data-bs-interval="3000">
                    <img src="" className="d-block w-100" alt="Third Item"/>
                    <div className="carousel-caption">
                        <h5>{ carouselItems[2].title }</h5>
                        <p>Price: ${ carouselItems[2].price }/month</p>
                    </div>
                </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselDark" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselDark" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
        <div className="container-fluid row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 row-cols-xxl-6 p-0 m-0" id="card-container">
            { Array.from({ length: 10 }, (_, i) => (
                    <div className="col p-1">
                        <ProductCard/>
                    </div>
            ))}
        </div>
    </div>
  )
}

export default Content
