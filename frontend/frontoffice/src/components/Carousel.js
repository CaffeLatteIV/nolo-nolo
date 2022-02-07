import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const URL = process.env.OPERATIONS_URL || 'https://site202156.tw.cs.unibo.it/v1/operations'

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
            {carouselItems.map((item, index) => (<button key={item.id} type="button" data-bs-target="#carouselDark" data-bs-slide-to={index} className="active" aria-current={index === 0 ? 'true' : ''} aria-label={`Slide ${index}`} />))}
          </div>
          <div className="carousel-inner">
            {carouselItems.map((item, index) => (
              <div key={item.id} className={index === 0 ? 'carousel-item active' : 'carousel-item'} data-bs-interval="3000">
                <div className="bg-white">
                  <img src={item.media.img} id="carousel" className="d-block" alt="Item" />
                  <Link to={`/product?id=${item.id}`}>
                    <div className="carousel-caption">
                      <h5>{item.title}</h5>
                      <p>Prezzo: ${item.price.weekday}/day</p>
                    </div>
                  </Link>

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
