import React from 'react'
// css
import './dashboard.css'

class Dashboard extends React.Component {
  render () {
    return (
      <div className="container-fluid overflow-hidden">
        <section className="row gx-5x">
          <this.SummaryPanel title="Fatturato" price={342156} change={4.5} />
          <this.SummaryPanel title="Fatturato" price={342156} change={-4.5} />
          <this.SummaryPanel title="Fatturato" price={342156} change={4.5} />
          <this.SummaryPanel title="Fatturato" price={342156} change={4.5} />
        </section>
        <section className="row g-2">
          <this.PiePanel title="Grafico torta"/>
          <this.PiePanel title="Grafico torta"/>

        </section>
      </div>
    )
  }

  SummaryPanel ({ title, price, change }) {
    let update = (
      <p><span className="positiveUpdate"><span className="material-icons upArrow">forward</span>
      {change} </span>dall&apos;ultimo update</p>)
    if (change < 0) {
      update = (
      <p><span className="negativeUpdate"><span className="material-icons downArrow">forward</span>
      {change} </span>dall&apos;ultimo update</p>)
    }
    return (
      <article className="col panel">
        <span className="p-3">
        <p>{title}</p>
        <h2 className="price">€{price}</h2>
        {update}</span>
      </article>
    )
  }

  PiePanel ({ title }) {
    return (
      <article className="col-3 panel"><h5>{title}</h5></article>
    )
  }
}

export default Dashboard
