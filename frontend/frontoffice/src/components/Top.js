import React from 'react'

import PropTypes from 'prop-types'
import Navbar from './Navbar.js'
import Searchbar from './Searchbar.js'
import Categories from './Categories.js'

function Top({ logged, setLogged }) {
  return (
    <div>
      <Navbar logged={logged} setLogged={setLogged} />
      <Searchbar />
      <Categories />
    </div>
  )
}
Top.propTypes = { logged: PropTypes.bool.isRequired, setLogged: PropTypes.func.isRequired }
export default Top
