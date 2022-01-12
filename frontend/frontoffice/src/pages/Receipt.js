/* eslint-disable dot-notation */
import React from 'react'
import moment from 'moment-business-days'
import PropTypes from 'prop-types'

function Receipt({ start, end, product }) {
  const daysBetweenDates = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  const businessDays = moment(end).businessDiff(moment(start))
  const holidayDays = daysBetweenDates - businessDays
  const price = product.price.weekdays * businessDays + product.price.weekends * holidayDays
  return (
    <div>
      Codice prodotto: {product['_id']}
      Titolo:{product.title}
      Descrizione: {product.description}
      condizione: {product.condition}
      Prezzo: <div> <div>Giorni lavorativi:{product.price.weekdays}</div><div>Giorni feriali: {product.price.weekends}</div> </div>
      Durata noleggio: {daysBetweenDates}
      TOTALE: {price}

    </div>
  )
}
Receipt.propTypes = {
  start: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  product: PropTypes.object.isRequired,
}
