import React, { useState, useEffect } from 'react'

import image from '../images/carousel-pic.jpg'

function Carousel () {
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
  }, [])
  return (
    <>
      <div className='p-2 md-02dp rounded'>
        <div id="carouselDark" className="carousel carousel-dark slide p-0 mb-0" data-bs-ride="carousel">
            <div className="carousel-indicators">
            <button type="button" data-bs-target="#carouselDark" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselDark" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselDark" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
            <div className="carousel-inner">
                <div className="carousel-item active" data-bs-interval="4000">
                    <img src={image} className="d-block w-100" alt="First Item" style={{ maxHeight: '50vh' /* this will be obsolete with use of personalized images that fit the actual content */ }}/>
                    <div className="carousel-caption">
                        <h5>{ carouselItems[0].title }</h5>
                        <p>Price: ${ carouselItems[0].price }/month</p>
                    </div>
                </div>
                <div className="carousel-item" data-bs-interval="3000">
                    <img src={image} className="d-block w-100" alt="Second Item" style={{ maxHeight: '50vh' }}/>
                    <div className="carousel-caption">
                        <h5>{ carouselItems[1].title }</h5>
                        <p>Price: ${ carouselItems[1].price }/month</p>

                    </div>
                </div>
                <div className="carousel-item" data-bs-interval="3000">
                    <img src={image} className="d-block w-100" alt="Third Item" style={{ maxHeight: '50vh' }}/>
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
      </div>
    </>
  )
}

export default Carousel
