import { getMonthlyRevenue, getStatus, getConditions, avgRentMonth, bestSellers, avgRentLength } from './requests.js'
const revenue = await getMonthlyRevenue()
const lineData = {
  labels: revenue.result.labels,
  datasets: [
    {
      label: "My First dataset",
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgb(255, 99, 132)",
      data: revenue.result.data,
    },
  ],
};
const lineConfig = {
  type: "line",
  data: lineData,
  options: {},
};
var lineChart = new Chart(document.getElementById("lineChart"), lineConfig);

//Setup for Doughnut Chart --> Contiene dati su disponibilità
const statusData = await getStatus()
const distrData = {
  labels: statusData.result.labels,
  datasets: [
    {
      label: "Oggetti in noleggio",
      data: statusData.result.data,
      backgroundColor: [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 205, 86)",
      ],
      hoverOffset: 0,
    },
  ],
};
const distrConfig = {
  type: "doughnut",
  data: distrData,
  options: {
    responsive: false,
  },
};
var distrChart = new Chart(document.getElementById("distrChart"), distrConfig);


//Setup for Doughnut Chart --> Contiene dati su condizioni
const conditions = await getConditions()
const condizioniData = {
  labels: conditions.result.labels,
  datasets: [
    {
      label: "Condizioni oggetti",
      data: conditions.result.data,
      backgroundColor: [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 205, 86)",
      ],
      hoverOffset: 0,
    },
  ],
};
const condizioniConfig = {
  type: "doughnut",
  data: condizioniData,
  options: {
    responsive: false,
  },
};
var condizioniChart = new Chart(document.getElementById("condizioniChart"), condizioniConfig);
async function setBestsellers() {
  const bestSellers = await bestSellers()
  let res = ''
  bestSellers.forEach((product) => {

    res += `<div class="col rounded px-3 md-0dp h-100">
    <a href="./itemStats.html" class="product-card-link p-2">
      <div class="p-4 border-0 md-02dp row rounded mx-2">
        <img src="" class="col-3" alt="Item Pic" />
        <div class="col-9 p-2">
          <h5 class="fw-bold text-white">${product.title}</h5>
          <p class="card-text text-white">
            <b>Descrizione: </b>${product.description}
          </p>
        </div>
      </div>
    </a>
  </div>`
  })
  $('#bestsellers').html(res)

}
$(document).ready(async function () {
  await setBestsellers()
  $("#numero-medio-noleggi-mese").text((await avgRentMonth()).result)
  $("#tempo-medio-noleggi").text((await avgRentLength()).result)
  //Inject values to make "Distribuzione" chart canvas accessible
  var numOggettiNoleggiati = distrData.datasets[0].data[0]
  var numOggettiDisponibili = distrData.datasets[0].data[1]
  var numOggettiPrenotati = distrData.datasets[0].data[2]
  $('#valoreOggettiInNoleggio').html(numOggettiNoleggiati)
  $('#valoreOggettiDisponibili').html(numOggettiDisponibili)
  $('#valoreOggettiPrenotati').html(numOggettiPrenotati)
  //Inject values to make "Condizioni" chart canvas accessible
  var numOttimi = condizioniData.datasets[0].data[0]
  var numBuono = condizioniData.datasets[0].data[1]
  var numParzDanneggiati = condizioniData.datasets[0].data[2]
  $('#valoreOttimeCond').html(numOttimi)
  $('#valoreBuoneCond').html(numBuono)
  $('#valoreParzDanneggiati').html(numParzDanneggiati)
  var gennaio = lineData.datasets[0].data[0]
  var febbraio = lineData.datasets[0].data[1]
  var marzo = lineData.datasets[0].data[2]
  var aprile = lineData.datasets[0].data[3]
  var maggio = lineData.datasets[0].data[4]
  var giugno = lineData.datasets[0].data[5]
  var luglio = lineData.datasets[0].data[6]
  var agosto = lineData.datasets[0].data[7]
  var settembre = lineData.datasets[0].data[8]
  var ottobre = lineData.datasets[0].data[9]
  var novembre = lineData.datasets[0].data[10]
  var dicembre = lineData.datasets[0].data[11]
  $('#gennaio').html(gennaio)
  $('#febbraio').html(febbraio)
  $('#marzo').html(marzo)
  $('#aprile').html(aprile)
  $('#maggio').html(maggio)
  $('#giugno').html(giugno)
  $('#luglio').html(luglio)
  $('#agosto').html(agosto)
  $('#settembre').html(settembre)
  $('#ottobre').html(ottobre)
  $('#novembre').html(novembre)
  $('#dicembre').html(dicembre)
})