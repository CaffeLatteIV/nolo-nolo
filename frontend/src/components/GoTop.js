import React from 'react'
import PropTypes from 'prop-types'

function GoTop (props) {
  return (
        <div >
            <button className={props.showGoTop} onClick={props.scrollUp} id='backToTopBtn' title="Go to top">
                <span className="material-icons">arrow_upward</span>
            </button>
        </div>
  )
}
GoTop.propTypes = { scrollUp: PropTypes.func.isRequired, showGoTop: PropTypes }

export default GoTop
