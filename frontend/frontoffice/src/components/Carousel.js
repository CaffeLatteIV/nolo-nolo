import React, { useState, useEffect } from 'react'
import axios from 'axios'

const URL = process.env.OPERATIONS_URL || 'http://localhost:5000/v1/operations'

function Carousel() {
  const [carouselItems, setCarouselItems] = useState(undefined)
  useEffect(async () => {
    const { data } = await axios.get(`${URL}/bestSellers?n=3`)
    const { bestSellers } = data
    if (!bestSellers) {
      setCarouselItems(undefined)
    } else {
      setCarouselItems(data.bestSellers)
    }
  }, [])
  return (carouselItems
    ? (
      <div className="p-2 md-02dp rounded">
        <div id="carouselDark" className="carousel carousel-dark slide p-0 mb-0" data-bs-ride="carousel">
          <div className="carousel-indicators">
            {carouselItems.map((item) => (<button key={item.id} type="button" data-bs-target="#carouselDark" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1" />))}
          </div>
          <div className="carousel-inner">
            {carouselItems.map((item) => (
              <div key={item.id} className="carousel-item active" data-bs-interval="3000">
                <img src={item.media.img} className="d-block w-100" alt="Item" style={{ maxHeight: '50vh' /* this will be obsolete with use of personalized images that fit the actual content */ }} />
                <div className="carousel-caption">
                  <h5>{item.title}</h5>
                  <p>Prezzo: ${item.price.weekday}/day</p>
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselDark" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselDark" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    )
    : <p>Caricamento</p>)
}

export default Carousel
