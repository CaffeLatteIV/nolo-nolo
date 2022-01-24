import React, { useState, useEffect } from 'react'
import axios from 'axios'

const URL = process.env.OPERATIONS_URL || 'http://localhost:5000/v1/operations'

function Carousel() {
  const [carouselItems, setCarouselItems] = useState(undefined)
  useEffect(async () => {
    const { data } = await axios.get(`${URL}/bestSellers?n=3`)
    const { bestSellers } = data
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!bestSellers) {
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
            {carouselItems[0] ? <button type="button" data-bs-target="#carouselDark" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1" /> : ''}
            {carouselItems[1] ? <button type="button" data-bs-target="#carouselDark" data-bs-slide-to="1" aria-label="Slide 2" /> : ''}
            {carouselItems[2] ? <button type="button" data-bs-target="#carouselDark" data-bs-slide-to="2" aria-label="Slide 3" /> : ''}
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active" data-bs-interval="4000">
              <img src={carouselItems[0].media.img} className="d-block w-100" alt="First Item" style={{ maxHeight: '50vh' /* this will be obsolete with use of personalized images that fit the actual content */ }} />
              <div className="carousel-caption">
                <h5>{carouselItems[0].title}</h5>
                <p>Prezzo: ${carouselItems[0].price.weekday}/day</p>
              </div>
            </div>
            {carouselItems[1] ? (
              <div className="carousel-item" data-bs-interval="3000">
                <img src={carouselItems[1].media.img} className="d-block w-100" alt="Second Item" style={{ maxHeight: '50vh' }} />
                <div className="carousel-caption">
                  <h5>{carouselItems[1].title}</h5>
                  <p>Prezzo: ${carouselItems[1].price.weekday}/day</p>

                </div>
              </div>
            ) : ''}

            {carouselItems[2] ? (
              <div className="carousel-item" data-bs-interval="3000">
                <img src={carouselItems[2].media.img} className="d-block w-100" alt="Second Item" style={{ maxHeight: '50vh' }} />
                <div className="carousel-caption">
                  <h5>{carouselItems[2].title}</h5>
                  <p>Prezzo: ${carouselItems[2].Prezzo.weekday}/day</p>

                </div>
              </div>
            ) : ''}
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
