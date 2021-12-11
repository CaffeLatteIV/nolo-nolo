import React from 'react'
import PropTypes from 'prop-types'
import './summaryPanel.css'

function SummaryPanel({ title, price, change }) {
  let update = (
    <p>
      <div className="positiveUpdate">
        <span className="material-icons upArrow">forward</span>
        {change}
      </div> dall&apos;ultimo update
    </p>
  )
  if (change < 0) {
    update = (
      <p>
        <div className="negativeUpdate">
          <span className="material-icons downArrow">forward</span>
          {change}
        </div>dall&apos;ultimo update
      </p>
    )
  }
  return (
    <article className="col-6 panel">
      <span className="p-3">
        <p>{title}</p>
        <h2 className="price">€{price}</h2>
        {update}
      </span>
    </article>
  )
}
SummaryPanel.propTypes = { title: PropTypes.string.isRequired, price: PropTypes.number.isRequired, change: PropTypes.number.isRequired }
export default SummaryPanel
