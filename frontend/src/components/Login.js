import React, { useState } from 'react'
import './Login.css'

const Form = () => {
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
                <div className='mt-2'>
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
                            email || isValid ? 'form__input' : 'form__input form__input--error'
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
                        Devi inserire l&apos;indirizzo email
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
                            password || isValid ? 'form__input' : 'form__input form__input--error'
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
                        Devi inserire una password
                        </div>
                    )}
                </div>
                <button type="submit" className="form__submit mt-3 p-1 px-2 text-black">
                    Accedi
                </button>
            </form>
            <div className='mt-2 text-center'>
                <a className='text-white' title='Registrati' href='#'>Non hai un account? Registrati qui</a>
            </div>
        </div>
    </div>
  </>
  )
}

export default Form
