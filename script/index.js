
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

//**********Fatch all card's data and render********//

const getStateValue = async function () {

    let stateLatestData = await (await fetch('https://api.covid19india.org/v4/min/data.min.json')).json()
    allState = stateLatestData;
    renderCardValue("TT")

    const timeSeriesData = await (await fetch('https://api.covid19india.org/v4/min/timeseries.min.json')).json()
    timeseries = timeSeriesData
    renderCardChange("TT")

}

getStateValue();

//**********Render the chart********//

const renderchart = function () {
    const covidChartObject = new Chart(covidChart, {
        type: 'line',
        data: {
            labels: ['First','Second','Thred','Fourth','Fifth'],
            datasets: [{
                label: 'Covid',
                data: [0, 20, 40, 50, 60],
                fill: 'none',
                pointBackgroundColor: 'red',
                pointBorderColor: 'red',
                borderColor: 'red',
            },{
                label: 'Bikram',
                data: [0, 30, 20, 60, 100],
                fill: 'none'
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
            
        }
    });
}
renderchart();