import React from 'react'
import PropTypes from 'prop-types'

function GoTop (props) {
  return (
    <>
      <button className={`bg-site-primary ${props.showGoTop}`} onClick={props.scrollUp} id='backToTopBtn' title="Torna su">
        <span className="material-icons text-black">arrow_upward</span>
      </button>
    </>
  )
}
GoTop.propTypes = { scrollUp: PropTypes.func.isRequired, showGoTop: PropTypes.string.isRequired }

export default GoTop
