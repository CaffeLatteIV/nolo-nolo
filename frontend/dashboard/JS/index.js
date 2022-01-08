//Setup for LineChart --> Da decidere cosa contenga come dati
const lineData = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      label: "My First dataset",
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgb(255, 99, 132)",
      data: [0, 10, 5, 2, 20, 30, 45],
    },
  ],
};
const lineConfig = {
  type: "line",
  data: lineData,
  options: {},
};
var myChart = new Chart(document.getElementById("lineChart"), lineConfig);

//Setup for Doughnut Chart --> Contiene dati su disponibilità
const doughnutData = {
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
const doughnutConfig = {
  type: "doughnut",
  data: doughnutData,
  options: {
    responsive: false,
  },
};
var myChart = new Chart(document.getElementById("pieChart"), doughnutConfig);

//TODO: 

//Inject values to make doughnut chart canvas accessible
$(document).ready(function(){
    var numOggettiNoleggiati = doughnutData.datasets[0].data[0]
    var numOggettiDisponibili = doughnutData.datasets[0].data[1]
    var numOggettiPrenotati = doughnutData.datasets[0].data[2]
    $('#valoreOggettiInNoleggio').html(numOggettiNoleggiati)
    $('#valoreOggettiDisponibili').html(numOggettiDisponibili)
    $('#valoreOggettiPrenotati').html(numOggettiPrenotati)
})