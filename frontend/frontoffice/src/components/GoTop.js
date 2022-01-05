import React from 'react'
import PropTypes from 'prop-types'

function GoTop({ showGoTop, scrollUp }) {
  return (
    <button type="submit" className={`bg-site-primary ${showGoTop}`} onClick={scrollUp} id="backToTopBtn" title="Torna su">
      <span className="material-icons text-black">arrow_upward</span>
    </button>
  )
}
GoTop.propTypes = { scrollUp: PropTypes.func.isRequired, showGoTop: PropTypes.string.isRequired }

export default GoTop
