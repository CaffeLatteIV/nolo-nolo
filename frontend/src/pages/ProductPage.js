import React, { useState } from 'react'
import productPic from '../images/product-pic.jpg'
function ProductPage () {
  // space for useStates and useEffects
  const productTitle = useState('Cuffie Beats Solo3 Wireless – Chip per cuffie Apple W1, Bluetooth di Classe 1, 40 ore di ascolto - Rosso')
  const productDescription = useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce laoreet posuere magna a tincidunt. Maecenas sit amet pharetra nulla.')
  const calculatedPrice = useState('41.57')
  document.title = productTitle
  return (
        <>
            <div className='container mt-2 md-0dp rounded'>
                <div className='row p-2'>
                    <h3 className='text-wrap p-2 rounded m-0'>{ productTitle }</h3>
                </div>
                <div className='row row-cols-1 row-cols-sm-1 row-cols-md-3 row-cols-lg-3 row-cols-xl-3 row-cols-xxl-3'>
                    {/* Contenitore immagine e collezione di immagini (?) */}
                    <div className='col p-2 h-100'>
                        <div className='md-02dp rounded p-4'>
                            <div className='row'>
                                <img src={ productPic } className="" alt="Item Pic"/>
                            </div>
                        </div>
                    </div>
                    {/* Contenitore Titolo, Descrizione, Calendario */}
                    <div className='col p-2'>
                        <div className='md-02dp rounded p-4 h-100'>
                            <p className='fw-bold m-0'>Descrizione: </p>
                            <p className='text-wrap'>{ productDescription }</p>
                        </div>
                    </div>
                    {/* Contenitore Prezzo finale per i giorni selezionati sul calendario di cui sopra, Bottone Noleggia e Bottone aggiungi al carrello */}
                    <div className='col p-2'>
                        <div className='md-02dp rounded h-100 p-4'>
                            <p className='fs-1 mb-0 text-center price'>€ { calculatedPrice } </p>
                            <div className='d-flex flex-column'>
                                <div className='p-2'>
                                    <button className='w-100 rounded p-2 fs-4 border-0 bg-site-primary'>Aggiungi al carrello</button>
                                </div>
                                <div className='p-2'>
                                    <button className='w-100 rounded p-2 fs-4 border-0 bg-site-primary'>Noleggia subito</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
  )
}

export default ProductPage
