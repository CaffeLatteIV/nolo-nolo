import React from 'react'

import PropTypes from 'prop-types'
import Navbar from './Navbar.js'
import Searchbar from './Searchbar.js'
import Categories from './Categories.js'

function Top({ updateLogged }) {
  return (
    <div>
      <Navbar updateLogged={updateLogged} />
      <Searchbar />
      <Categories />
    </div>
  )
}
Top.propTypes = { updateLogged: PropTypes.bool.isRequired }
export default Top
