import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import '../css/Login.css'

function Login ({ isLogging }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isValid, setValid] = useState(true)
  const setText = event => {
    event.target.name === 'name'
      ? setEmail(event.target.value)
      : setPassword(event.target.value)
  }

  const validate = () => {
    setValid(!!email && !!password)
    if (!email) {
      document.querySelector('#email').focus()
    } else if (!password) {
      document.querySelector('#password').focus()
    }
  }
  const onSubmit = event => {
    event.preventDefault()
    validate()
  }

  return (
  <>
    <div className='container p-3'>
        <div className='p-4 mt-4 md-01dp rounded'>
            <form className="form" onSubmit={onSubmit}>
                <div className='mt-2 justify-content-center'>
                    <label
                        className={
                            email || isValid ? 'form__label' : 'form__label form__label--error'
                        }
                    >
                        E-mail
                        <input
                        type="text"
                        name="name"
                        id="email"
                        className={
                            email || isValid ? 'form__input w-100 ' : 'form__input form__input--error w-100'
                        }
                        value={email}
                        onChange={setText}
                        aria-required="true"
                        aria-invalid={!email && !isValid}
                        aria-describedby="mailAlert"
                        />
                    </label>
                    {!isValid && !email && (
                        <div
                        role="alert"
                        aria-atomic="true"
                        id="mailAlert"
                        className="form__alert"
                        >
                        Devi inserire la tua email
                        </div>
                    )}
                </div>
                <div className='mt-2'>
                    <label
                        className={
                            password || isValid ? 'form__label' : 'form__label form__label--error'
                        }
                    >
                        Password
                        <input
                        type="password"
                        name="password"
                        id="password"
                        className={
                            password || isValid ? 'form__input w-100' : 'form__input form__input--error w-100'
                        }
                        value={password}
                        onChange={setText}
                        aria-required="true"
                        aria-invalid={!password && !isValid}
                        aria-describedby="passwordAlert"
                        />
                    </label>
                    {!isValid && !password && (
                        <div
                        aria-live="polite"
                        role="alert"
                        aria-atomic="true"
                        id="passwordAlert"
                        className="form__alert"
                        >
                        Devi inserire la tua password
                        </div>
                    )}
                </div>
                <button type="submit" className="form__submit mt-3 p-1 px-2 text-black">
                    { isLogging ? 'Accedi' : 'Registrati' }
                </button>
            </form>
            <div className='mt-2 text-center'>
                {isLogging ? <Link to='/register' className='text-white' title='Registrati'>Non hai un account? Registrati qui</Link> : <Link to='/login' className='text-white' title='Accedi'>Hai già un account? Accedi qui</Link> }
            </div>
        </div>
    </div>
  </>
  )
}
Login.propTypes = { isLogging: PropTypes.bool.isRequired }

export default Login
