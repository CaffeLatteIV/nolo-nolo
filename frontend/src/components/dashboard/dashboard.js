import React from 'react'
import PropTypes from 'prop-types'
import SummaryPanel from '../summaryPanel/summaryPanel'
// css
import './dashboard.css'

function PiePanel({ title }) {
  return (
    <article className="col-6 panel"><h5>{title}</h5></article>
  )
}
function Dashboard() {
  return (
    <div className="container-fluid mb-5 mt-2">
      <div className="row mx-2">
        <div className="col-4 p-1">
          <section className="row">
            <SummaryPanel title="Fatturato" price={342156} change={4.5} />
            <SummaryPanel title="Fatturato" price={342156} change={-4.5} />
            <SummaryPanel title="Fatturato" price={342156} change={4.5} />
            <SummaryPanel title="Fatturato" price={342156} change={4.5} />
          </section>
        </div>

        <div className="col-8 p-1">
          <section className="row h-100">
            <PiePanel title="Grafico torta" />
            <PiePanel title="Grafico torta" />
          </section>

        </div>
      </div>
      <div className="row mx-2" />
      <section className="col-12 panel">
        <p>grafico</p>
      </section>
      <section className="col-12 panel">
        <p>grafico</p>
      </section>
    </div>
  )
}

PiePanel.propTypes = { title: PropTypes.string.isRequired }
export default Dashboard
