import React, { useState } from 'react'

import PersonalInfo from '../components/Personalnfo.js'
import AccountPreferences from '../components/AccountPrefereneces.js'

function Account() {
  const [isPersonal, setIsPersonal] = useState(true)
  const goToPersonalInfo = () => {
    setIsPersonal(true)
  }
  const goToPreferences = () => {
    setIsPersonal(false)
  }
  return (
    <div className="container p-2">
      <div className="container md-01dp mt-4 rounded p-4">
        <h1 className="mb-4 text-center">Informazioni Account</h1>
        <div className="row">
          <div className="col-sm-1 col-lg-4" />
          <div className="col-sm-10 col-lg-4 tab-container">
            <div className="row">
              <div className="col mb-4 p-2 text-center">
                <button type="button" className={`w-100 h-100 text-white ${isPersonal ? 'fw-bold border-bottom' : ' border-bottom border-secondary'} border-3`} id="tabController1" onClick={goToPersonalInfo}>Dati Personali</button>
              </div>
              <div className="col mb-4 p-2 text-center">
                <button type="button" className={`w-100 h-100 text-white ${isPersonal ? ' border-bottom border-secondary' : 'fw-bold border-bottom'} border-3`} id="tabController2" onClick={goToPreferences}>Preferenze</button>
              </div>
            </div>

          </div>
          <div className="col-sm-1 col-lg-4" />
        </div>
        { isPersonal ? <PersonalInfo /> : <AccountPreferences />}
      </div>
    </div>
  )
}

export default Account
