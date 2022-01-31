import React, { useState } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie'
import { useNavigate } from 'react-router-dom'

function Register(setLogged) {
  const [gender, setGender] = useState('')
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [birthDate, setBirtDate] = useState('')
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [email, setEmail] = useState('')
  const navigate = useNavigate()
  async function registerUser() {
    const { data } = await axios({
      method: 'post',
      url: `${URL}v1/clients/login`,
      data: {
        client: {
          email,
          password,
          gender,
          address,
          phoneNumber,
          birthDate,
          name,
          surname,
        },
      },
    })
    if (data && data.accessToken && data.refreshToken && data.client) {
      const cookies = new Cookies()
      cookies.set('accessToken', data.accessToken, { path: '/', sameSite: 'Lax' })
      cookies.set('refreshToken', data.refreshToken, { path: '/', sameSite: 'Lax' })
      cookies.set('client', data.client, { path: '/', sameSite: 'Lax' })
      return true
    }
    return false
  }
  async function handleClick() {
    const logged = await registerUser(email, password)
    setLogged(logged)
    navigate('/', { replace: true })
  }
  return (
    <form className="w-50 m-auto" id="accountInfo">
      <div className="row mb-4">
        <div className="col">
          <label className="form-label ps-2 w-100" htmlFor="nomeInput">
            <input
              type="text"
              id="nomeInput"
              className="form-control"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />Nome
          </label>
        </div>
        <div className="col">
          <label className="form-label ps-2 w-100" htmlFor="cognomeInput">
            <input
              onChange={(e) => setSurname(e.target.value)}
              value={surname}
              type="text"
              id="cognomeInput"
              className="form-control"
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
            onChange={(e) => setAddress(e.target.value)}
            value={address}
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
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />Email
          </label>
        </div>
        <div className="col">
          <label className="form-label ps-2 w-100" htmlFor="passwordInput">
            <input
              type="password"
              id="passwordInput"
              className="form-control"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
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
                onChange={(e) => setBirtDate(new Date(e).getTime())}
                value={birthDate}
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
                onChange={(e) => setPhoneNumber(e.target.value)}
                value={phoneNumber}
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
                onChange={(e) => setGender(e.target.value)}
                value="Femmina"
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
                onChange={(e) => setGender(e.target.value)}
                value="Maschio"
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
                onChange={(e) => setGender(e.target.value)}
                value="Non specificato"
              />Non specificato
            </label>
          </div>
        </fieldset>
      </div>

      {/* Submit button */}
      <button type="submit" onClick={handleClick} className="btn btn-primary mb-4 text-black">
        Registrati
      </button>
    </form>
  )
}

export default Register
