import React, { useState } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie'
import { useNavigate } from 'react-router-dom'
import 'react-datepicker/dist/react-datepicker.css'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'

function Register({ setLogged }) {
  const [gender, setGender] = useState('')
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [birthDate, setBirthDate] = useState(new Date())
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState(false)
  const navigate = useNavigate()
  async function registerUser() {
    const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5000/v1/clients'
    const client = {
      email,
      password,
      gender,
      address,
      phoneNumber,
      birthDate: new Date(birthDate).getTime(),
      name,
      surname,
    }
    const { data } = await axios.post(`${CLIENT_URL}/register`, { client }, { validateStatus: false })
    const status = data?.code
    if (data && data.accessToken && data.refreshToken && data.client && !status) {
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
    if (logged) {
      navigate('/', { replace: true })
    } else {
      setError(true)
    }
  }
  return (
    <div className="row w-100">
      <div className="col-sm-1 col-lg-3" />
      <div className="col-sm-10 col-lg-6" id="accountInfo">
        <div className="row">
          <div className="col-sm-12 col-lg-6">
            <label className="form-label  w-100 mb-4" htmlFor="nomeInput">
              <input
                type="text"
                id="nomeInput"
                className="form-control"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />Nome
            </label>
          </div>
          <div className="col-sm-12 col-lg-6">
            <label className="form-label  w-100 mb-4" htmlFor="cognomeInput">
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
        <div className="">
          <label className="form-label  w-100 mb-4" htmlFor="addressInput">
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
        <div className="row ">
          <div className="col-sm-12 col-lg-6">
            <label className="form-label  w-100 mb-4" htmlFor="emailInput">
              <input
                type="email"
                id="emailInput"
                className="form-control"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />Email
            </label>
          </div>
          <div className="col-sm-12 col-lg-6">
            <label className="form-label  w-100 mb-4" htmlFor="passwordInput">
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
          <div className="col-sm-12 col-lg-6">
            <div className="mb-4">
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label
                htmlFor="dateInput"
                className="form-label  w-100"
              >
                <DatePicker
                  selected={birthDate}
                  onChange={(date) => setBirthDate(date)}
                  dateFormat="dd/MM/yyyy"
                  scrollableMonthYearDropdown
                  withPortal
                  maxDate={new Date()}
                  className="rounded border-0 form-control w-100"
                  calendarClassName="text-white border-0"
                  id="datepicker"
                />
                Data di nascita
              </label>
            </div>
          </div>
          <div className="col-sm-12 col-lg-6">
            <div className="mb-4">
              <label className="form-label  w-100" htmlFor="phoneNumber">
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
        <button type="submit" onClick={handleClick} className="btn btn-primary p mb-4 text-black">
          Registrati
        </button>
      </div>
      <div className="col-sm-1 col-lg-3" />
      {error ? <p className="text-center text-danger">Dati mancanti o utente già registrato</p> : ''}
    </div>
  )
}
Register.propTypes = { setLogged: PropTypes.func.isRequired }
export default Register
