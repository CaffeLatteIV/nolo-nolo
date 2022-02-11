import React, { useState } from 'react'

function Payment() {
  const { newRent } = useState([])
  const { daysBetweenDates } = useState([])
  const { spentFidelityPoints } = useState([])
  const { earnedFidelityPoints } = useState([])
  const { coupon } = useState([])
  const { price } = useState([])
  const lateFee = 80378
  //   handleConfirm(){
  //     console.log("modify me")
  //   }
  return (
    <div className="container p-2">
      <div className="md-01dp p-4 mt-4 rounded">
        <h1>Riepilogo Ordine</h1>
        <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold">Codice prodotto:</span>
          </div>
          <div className="col-sm-6 col-md-9">{newRent}</div>
        </div>
        <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold">Titolo:</span>
          </div>
          <div className="col-sm-6 col-md-9">{newRent}</div>
        </div>
        <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold">Descrizione:</span>
          </div>
          <div className="col-sm-6 col-md-9">{newRent}</div>
        </div>
        <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold">Durata noleggio:</span>
          </div>
          <div className="col-sm-6 col-md-9">{daysBetweenDates} giorn{daysBetweenDates === 1 ? 'o' : 'i'}</div>
        </div>
        <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold">Prezzo giorni feriali:</span>
          </div>
          <div className="col-sm-6 col-md-9">{newRent}€</div>
        </div>
        <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold">Prezzo giorni festivi:</span>
          </div>
          <div className="col-sm-6 col-md-9">{newRent}</div>
        </div>
        <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold">Punti fedeltà spesi:</span>
          </div>
          <div className="col-sm-6 col-md-9">{spentFidelityPoints}
          </div>
        </div>
        <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold">Punti fedeltà guadagnati:</span>
          </div>
          <div className="col-sm-6 col-md-9">{earnedFidelityPoints}
          </div>
        </div>
        <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold">Sconto applicato:</span>
          </div>
          <div className="col-sm-6 col-md-9">{coupon ? `${coupon}%` : '-'}
          </div>
        </div>
        { (lateFee > 0) ? (
          <div className="row border-bottom border-secondary p-2">
            <div className="col-sm-6 col-md-3">
              <span className="fw-bold">Tassa di ritardo:</span>
            </div>
            <div className="col-sm-6 col-md-9">{lateFee}
            </div>
          </div>
        ) : ''}

        <div className="row border-bottom border-secondary p-2">
          <div className="col-sm-6 col-md-3">
            <span className="fw-bold fs-3">TOTALE:</span>
          </div>
          <div className="col-sm-6 col-md-9 fs-3">{price}€</div>
        </div>
        <button
          type="button"
          className="btn text-black mt-4 bg-site-primary"
        >
          Paga e restituisci
        </button>
      </div>
    </div>
  )
}

export default Payment
