import React from 'react'

function Register() {
  return (
    <form className="w-50 m-auto" id="accountInfo">
      <div className="row mb-4">
        <div className="col">
          <label className="form-label ps-2 w-100" htmlFor="nomeInput">
            <input
              type="text"
              id="nomeInput"
              className="form-control"
              value=""
            />Nome
          </label>
        </div>
        <div className="col">
          <label className="form-label ps-2 w-100" htmlFor="cognomeInput">
            <input
              type="text"
              id="cognomeInput"
              className="form-control"
              value=""
            />Cognome
          </label>
        </div>
      </div>

      {/* address input */}
      <div className="mb-4">
        <label className="form-label ps-2 w-100" htmlFor="addressInput">
          <input
            type="text"
            id="addressInput"
            className="form-control"
            value=""
          />Indirizzo
        </label>
      </div>

      {/* Email and password input */}
      <div className="row mb-4">
        <div className="col">
          <label className="form-label ps-2 w-100" htmlFor="emailInput">
            <input
              type="email"
              id="emailInput"
              className="form-control"
              value=""
            />Email
          </label>
        </div>
        <div className="col">
          <label className="form-label ps-2 w-100" htmlFor="passwordInput">
            <input
              type="password"
              id="passwordInput"
              className="form-control"
              value=""
            />Password
          </label>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div className="mb-4">
            <label
              htmlFor="dateInput"
              className="form-label ps-2 w-100"
            >
              <input
                type="date"
                className="form-control"
                id="dateInput"
                value=""
              />Data di nascita
            </label>
          </div>
        </div>

        <div className="col">
          <div className="mb-4">

            <label className="form-label ps-2 w-100" htmlFor="phoneNumber">
              <input
                type="tel"
                id="phoneNumber"
                className="form-control"
                value=""
              />Telefono
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
                value="option1"
              />Femmina
            </label>
          </div>

          <div className="form-check form-check-inline mb-0 me-4">

            <label className="form-check-label" htmlFor="maleGender">
              <input
                className="form-check-input"
                type="radio"
                name="inlineRadioOptions"
                id="maleGender"
                value="option2"
              />Maschio
            </label>
          </div>

          <div className="form-check form-check-inline mb-0">

            <label className="form-check-label" htmlFor="otherGender">
              <input
                className="form-check-input"
                type="radio"
                name="inlineRadioOptions"
                id="otherGender"
                value="option3"
              />Altro
            </label>
          </div>
        </fieldset>
      </div>

      {/* Submit button */}
      <button type="submit" className="btn btn-primary mb-4 text-black">
        Registrati
      </button>
    </form>
  )
}

export default Register
