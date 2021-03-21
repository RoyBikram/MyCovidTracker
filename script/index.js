
//**********All dom selecter*********//

const covidChart = document.querySelector(".covidChart")
const cardConfirmed = document.querySelector(".cardConfirmed")
const cardActive = document.querySelector(".cardActive")
const cardRecovered = document.querySelector(".cardRecovered")
const cardDeath = document.querySelector(".cardDeath")

//**********Global Variables********//

let allState = {};
let value = 0;
let timeseries = {};
let lastUpdateTime = "";
let presentDayData = 0;
let previousDayData = 0;

//*********Chart Object *********/

let covidChartObject = new Chart(covidChart, {
    type: 'line',
    data: {
        labels:[],
        datasets: [{
            label: 'Confirmed',
            data: [],
            fill: 'none',
            backgroundColor: 'red',
            pointRadius: "0",
            borderColor: "red",
            borderWidth: "2.5",
            pointHoverRadius: "3"
        }
            , {
            label: 'Active',
            data: [],
            fill: 'none',
            backgroundColor: 'rgb(0, 168, 255)',
            pointRadius: 0,
            borderColor: "rgb(0, 168, 255)",
            borderWidth: "2.5",
            pointHoverRadius: "3"
        },{
            label: 'Recovered',
            data: [],
            fill: 'none',
                pointRadius: 0,
            backgroundColor: "green",
            borderColor: "green",
            borderWidth: "2.5",
            pointHoverRadius: "3"
        },{
            label: 'Death',
                data: [],
            fill: 'none',
            pointRadius: 0,
            backgroundColor: "rgb(113, 128, 147)",
            borderColor: "rgb(113, 128, 147)",
            borderWidth: "2.5",
            pointHoverRadius: "3"
        }
        ]
    },
    options: {
        scales: {
            yAxes: [{
                gridLines : {
                    drawOnChartArea: false
                },
            }],
            xAxes: [{
                gridLines : {
                    drawOnChartArea: false
                },
              }]
        },
        responsive: true,
        animation: {
            duration: 500,
            
        }
    }
});

//*******It gives past day date*************//
//!need to improve the past date function

const pastDate = function () {

    let today = new Date();
    let todayArray = [];
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    return today = `${yyyy}-${mm}-${String(Number(dd)-1)}`
    
}

//***********It render all card's values***********//

const renderCardValue = function (location) {

    presentDayData = allState[location].total
    // lastUpdatedTime = allState[location].meta.last_updated.slice(0, 10)
    cardConfirmed.querySelector(".value").textContent =presentDayData.confirmed;
    cardActive.querySelector(".value").textContent = (presentDayData.confirmed-(presentDayData.recovered+presentDayData.deceased));
    cardRecovered.querySelector(".value").textContent = presentDayData.recovered;
    cardDeath.querySelector(".value").textContent = presentDayData.deceased;
    
}

//***********It render all card's Changes***********//

const renderCardChange = function (location) {

    previousDayData = timeseries[location].dates[`${pastDate()}`].total

    //To get active change data
    let activeChange =(presentDayData.confirmed - (presentDayData.recovered + presentDayData.deceased)) - (previousDayData.confirmed - (previousDayData.recovered + previousDayData.deceased))
    
    cardConfirmed.querySelector(".change").textContent = `+${(presentDayData.confirmed - previousDayData.confirmed)}`;
    cardActive.querySelector(".change").textContent = `${(activeChange >= 0 ? "+" : "-")}${activeChange}`;
    cardRecovered.querySelector(".change").textContent = `+${(presentDayData.recovered - previousDayData.recovered)}`;
    cardDeath.querySelector(".change").textContent = `+${(presentDayData.deceased - previousDayData.deceased)}`;

}

//*******Update the chart *******/

const updateChart = function (location) {
    covidChartObject.data.labels = [];
    covidChartObject.data.datasets[0].data = [];
    covidChartObject.data.datasets[1].data = [];
    covidChartObject.data.datasets[2].data = [];
    covidChartObject.data.datasets[3].data = [];
    const confirmedList = [];
    const activeList = [];
    const recoveredList = [];
    const deathList = [];
    const dateList = Object.keys(timeseries[location].dates)
    const removeLastDate = dateList.pop()
    covidChartObject.data.labels = dateList
    dateList.forEach(each => {
        const listPath = timeseries[location].dates[each].total
        confirmedList.push(listPath.confirmed ?? 0)
        activeList.push(listPath.confirmed-(listPath.recovered ?? 0+listPath.deceased ?? 0))
        recoveredList.push(listPath.recovered ?? 0)
        deathList.push(listPath.deceased ?? 0);
    })
    covidChartObject.data.datasets[0].data = confirmedList
    covidChartObject.data.datasets[1].data = activeList
    covidChartObject.data.datasets[2].data = recoveredList
    covidChartObject.data.datasets[3].data = deathList
    covidChartObject.update();
    
}

//**********Fatch all card's data and render********//

const getStateValue = async function () {

    let stateLatestData = await (await fetch('https://api.covid19india.org/v4/min/data.min.json')).json()
    allState = stateLatestData;
    renderCardValue("TT")

    const timeSeriesData = await (await fetch('https://api.covid19india.org/v4/min/timeseries.min.json')).json()
    timeseries = timeSeriesData
    renderCardChange("TT")
    updateChart("TT");

    // Map hover card's data change effect
    const indiaMapSvg = document.querySelector('.indiaMapSvg');
    indiaMapSvg.addEventListener('mouseover', function (e) {
        e.preventDefault()
        if (e.target.classList.contains('state')) {
            const id = e.target.getAttribute('href')
            renderCardValue(id)
            renderCardChange(id)
            updateChart(id);
        }
    })
    
}

getStateValue();


