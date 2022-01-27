import React, { useState } from 'react'

import Cookies from 'universal-cookie'

function PersonalInfo() {
  const cookies = new Cookies()
  const client = cookies.get('client')
  const [gender, setGender] = useState()
  const handleRadioChange = (e) => {
    setGender(e.target.value)
  }
  return (

    <form id="accountInfo" className="w-50 m-auto">
      <div className="row mb-4">
        <div className="col">
          <div>
            <label className="form-label" htmlFor="nomeInput">
              <input
                type="text"
                id="nomeInput"
                className="form-control"
                value="John"
              />
              Nome
            </label>
          </div>
        </div>
        <div className="col">
          <div>
            <label className="form-label" htmlFor="cognomeInput">
              <input
                type="text"
                id="cognomeInput"
                className="form-control"
                value="Doe"
              />
              Cognome
            </label>
          </div>
        </div>
      </div>

      {/* address input */}
      <div className="mb-4">
        <label className="form-label" htmlFor="addressInput">
          <input
            type="text"
            id="addressInput"
            className="form-control"
            value="via Arcobaleno 38"
          />
          Indirizzo
        </label>
      </div>

      {/* Email input */}
      <div className="mb-4">
        <label className="form-label" htmlFor="emailInput">
          <input
            type="email"
            id="emailInput"
            className="form-control"
            value={client.email}
          />
          Email
        </label>
      </div>

      <div className="row">
        <div className="col">
          <div className="mb-4">
            <label htmlFor="dateInput" className="form-label">
              <input
                type="date"
                className="form-control"
                id="dateInput"
                value="1946-06-02"
              />
              Data di nascita
            </label>
          </div>
        </div>

        <div className="col">
          <div className="mb-4">
            <label className="form-label" htmlFor="phoneNumber">
              <input
                type="tel"
                id="phoneNumber"
                className="form-control"
                value="3335719046"
              />
              Telefono
            </label>
          </div>
        </div>
      </div>

      <div className="d-md-flex justify-content-start align-items-center mb-4 pb-2">
        <fieldset>
          <legend className="mb-0 me-4 fs-5">Genere:</legend>
          <div className="form-check form-check-inline mb-0 me-4">
            <label className="form-check-label" htmlFor="femaleGender">
              <input
                className="form-check-input"
                type="radio"
                name="inlineRadioOptions"
                id="femaleGender"
                value="F"
                onChange={handleRadioChange}
                checked={gender === 'F'}
              />
              Femmina
            </label>
          </div>
          <div className="form-check form-check-inline mb-0 me-4">
            <label className="form-check-label" htmlFor="maleGender">
              <input
                className="form-check-input"
                type="radio"
                name="inlineRadioOptions"
                id="maleGender"
                value="M"
                onChange={handleRadioChange}
                checked={gender === 'M'}
              />
              Maschio
            </label>
          </div>
          <div className="form-check form-check-inline mb-0">
            <label className="form-check-label" htmlFor="otherGender">
              <input
                className="form-check-input"
                type="radio"
                name="inlineRadioOptions"
                id="otherGender"
                value="O"
                onChange={handleRadioChange}
                checked={gender === 'O'}
              />
              Altro {gender}
            </label>
          </div>
        </fieldset>
      </div>
      {/* Submit button */}
      <button type="submit" className="btn mb-4 text-black">
        Conferma modifiche
      </button>
    </form>
  )
}

export default PersonalInfo
