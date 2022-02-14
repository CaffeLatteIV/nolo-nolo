import {countClientGender, groupClientAge} from './requests.js'
// let searchParams = new URLSearchParams(window.location.search)
// let client = searchParams.get('client')
//Setup for Bar Chart --> Contiene dati su età clienti
const ageClients = (await groupClientAge()).result
const ageData = {
    labels: ageClients.labels,
    datasets: [{
        label: 'Età clienti',
        data: ageClients.data,
        backgroundColor: [
            "#1DA1F2"
        ],
        borderRadius: 5
    }]
};
const ageConfig = {
    type: 'bar',
    data: ageData,
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    },
};
var ageChart = new Chart(document.getElementById("ageChart"), ageConfig);
const genderList = (await countClientGender()).result
const genderData = {
    labels: genderList.labels,
    datasets: [{
        label: 'Genere',
        data: genderList.data,
        backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
        ],
    }]
};
const genderConfig = {
    type: 'pie',
    data: genderData,
    options: {
        responsive: false,
    },
};
var genderChart = new Chart(document.getElementById("genderChart"), genderConfig);

$(document).ready(function () {
    //Inject gender data for accessibility
    var maschi = genderData.datasets[0].data[0]
    var femmine = genderData.datasets[0].data[1]
    var nonSpec = genderData.datasets[0].data[2]
    $('#maschi').html(maschi)
    $('#femmine').html(femmine)
    $('#nonSpec').html(nonSpec)
    var fOne = genderData.datasets[0].data[0]
    var fTwo = genderData.datasets[0].data[1]
    var fThree = genderData.datasets[0].data[2]
    var fFourth = genderData.datasets[0].data[3]
    var fFifth = genderData.datasets[0].data[4]
    var fSixth = genderData.datasets[0].data[5]
    var fSeventh = genderData.datasets[0].data[6]
    $('#f1').html(fOne)
    $('#f2').html(fTwo)
    $('#f3').html(fThree)
    $('#f4').html(fFourth)
    $('#f5').html(fFifth)
    $('#f6').html(fSixth)
    $('#f7').html(fSeventh)
})