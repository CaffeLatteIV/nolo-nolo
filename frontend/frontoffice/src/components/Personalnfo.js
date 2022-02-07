import React, { useState } from 'react'
import dayjs from 'dayjs'
import Cookies from 'universal-cookie'
import axios from 'axios'

import validateAcessToken from './Tokens.js'

const CLIENT_URL = process.env.CLIENT_URL || 'https://site202156.tw.cs.unibo.it/v1/clients'
function PersonalInfo() {
  const cookies = new Cookies()
  const client = cookies.get('client')
  const [gender, setGender] = useState(client.gender)
  const [address, setAddress] = useState(client.address)
  const [phoneNumber, setPhoneNumber] = useState(client.phoneNumber)
  const [birthDate, setBirtDate] = useState(client.birthDate)
  const [name, setName] = useState(client.name)
  const [surname, setSurname] = useState(client.surname)
  const [email, setEmail] = useState(client.email)
  async function updateChanges() {
    await validateAcessToken()
    const accessToken = cookies.get('accessToken')
    const brthDateNumber = new Date(birthDate).getTime()
    const clientData = { id: client.id, name, surname, phoneNumber, birthDate: brthDateNumber, email, gender, address }
    cookies.remove('client', { path: '/' })
    cookies.set('client', clientData, { path: '/', sameSite: 'lax' })
    await axios.post(`${CLIENT_URL}/update/personalInfo`, { client: clientData }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-type': 'application/json',
      },
    })
  }
  return (

    <div id="accountInfo" className="w-50 m-auto">
      <div className="row mb-4">
        <div className="col">
          <div>
            <label className="form-label" htmlFor="nomeInput">
              <input
                type="text"
                id="nomeInput"
                className="form-control"
                onChange={(e) => setName(e.target.value)}
                value={name || 'Inserisci il nome'}
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
                onChange={(e) => setSurname(e.target.value)}
                value={surname || 'Inserisci il cognome'}
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
            onChange={(e) => setAddress(e.target.value)}
            value={address || 'Aggiungi indirizzo'}
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
            onChange={(e) => setEmail(e.target.value)}
            value={email}
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
                onChange={(e) => setBirtDate(e.target.value)}
                value={birthDate ? dayjs(birthDate).format('YYYY-MM-DD') : 'gg/mm/aaaa'}
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
                onChange={(e) => setPhoneNumber(e.target.value)}
                value={phoneNumber || '335 00000000'}
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
                value="Femmina"
                onChange={(e) => setGender(e.target.value)}
                checked={gender === 'Femmina'}
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
                value="Maschio"
                onChange={(e) => setGender(e.target.value)}
                checked={gender === 'Maschio'}
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
                value="Non specificato"
                onChange={(e) => setGender(e.target.value)}
                checked={gender === 'Non specificato'}
              />
              Non specificato
            </label>
          </div>
        </fieldset>
      </div>
      {/* Submit button */}
      <button type="submit" className="btn mb-4 text-black" onClick={updateChanges}>
        Conferma modifiche
      </button>
    </div>
  )
}

export default PersonalInfo
