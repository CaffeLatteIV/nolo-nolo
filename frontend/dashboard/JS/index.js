//Setup for LineChart --> Da decidere cosa contenga come dati
const lineData = {
  labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
  datasets: [
    {
      label: "My First dataset",
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgb(255, 99, 132)",
      data: [13, 10, 45, 10, 20, 30, 45, 33, 65, 23, 19, 50],
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
const distrData = {
  labels: ["Noleggiati", "Disponibili", "Prenotati"],
  datasets: [
    {
      label: "Oggetti in noleggio",
      data: [300, 50, 100],
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
const condizioniData = {
  labels: ["Ottimi", "Buoni", "Parzialmente Danneggiati"],
  datasets: [
    {
      label: "Condizioni oggetti",
      data: [330, 500, 120],
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

$(document).ready(function () {
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