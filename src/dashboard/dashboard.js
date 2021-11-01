import React from 'react'
// css
import './css/dashboard.css'

class Dashboard extends React.Component {
  render () {
    return (
      <div className="row">
      <section className="row col-4">
        <this.Panel title="Fatturato" price={342156} change={+4.5}/>
        <this.Panel title="Fatturato" price={342156} change={+4.5}/>
      </section>
      <article className="col-8 panel">cc</article>
      </div>
    )
  }

  Panel ({ title, price, change }) {
    return (
    <article className="col panel mx-2">
      <p>{title}</p>
      <h2>€{price}</h2>
      <p>{change}</p>
    </article>
    )
  }
}

export default Dashboard
