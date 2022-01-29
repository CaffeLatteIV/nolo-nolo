import React from 'react'

function Login() {
  return (
    <form className="w-50 m-auto" id="accountInfo">
      <div className="mb-4">
        <label className="form-label mb-4" htmlFor="emailInput">
          <input
            type="email"
            id="emailInput"
            className="form-control"
            value=""
          />Email
        </label>
        <br />
        <label className="form-label  mb-4" htmlFor="passwordInput">
          <input
            type="password"
            id="passwordInput"
            className="form-control"
            value=""
          />Password
        </label>
      </div>
      <button type="submit" className="btn btn-primary mb-4 text-black">
        Registrati
      </button>
    </form>
  )
}

export default Login
