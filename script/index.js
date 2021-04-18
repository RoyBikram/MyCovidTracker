
//**********All dom selecter*********//

const covidChart = document.querySelector(".covidChart")
const cardConfirmed = document.querySelector(".cardConfirmed")
const cardActive = document.querySelector(".cardActive")
const cardRecovered = document.querySelector(".cardRecovered")
const cardDeath = document.querySelector(".cardDeath")
const stateLabel = document.querySelector(".stateLabel")
const selectedState = document.querySelector(".regions")
let selectedStateName = "TT"
const cardsContainer = document.querySelector(".cardsContainer");
const allCards = cardsContainer.querySelectorAll('.card')
const cardsValue = cardsContainer.querySelectorAll(".value")
const stateBorder = document.querySelector('.state-borders')

//**********Global Variables********//

let allState = {};
let value = 0;
let timeseries = {};
let lastUpdateTime = "";
let presentDayData = 0;
let previousDayData = 0;
let chartState = "Active";

//*********Chart Object *********/

let covidChartObject = new Chart(covidChart, {
    type: 'line',
    data: {
        labels:[],
        datasets: []
    },
    options: {
        legend: {
            display: false,
        },
        scales: {
            yAxes: [{
                position:"right",
                gridLines: {
                    drawOnChartArea: false
                },
                ticks: {
                    maxTicksLimit : 5
                }
            }],
            xAxes: [{
                gridLines : {
                    drawOnChartArea: false,
                    drawTicks:false
                },
                ticks: {
                    display: false,
                }
              }]
        },
        responsive: true,
        animation: {
            duration: 500,
        }
    }
});

//*******It gives past day date*************//

const pastDate = function () {
    const dateList = Object.keys(timeseries.TT.dates)
    const previousDay = dateList[dateList.length - 2]
    console.log(previousDay)
    return previousDay
}

//***********It render all card's values***********//

const renderCardValue = function (location) {
    const duration = 500;
        presentDayData = allState[location].total;
        let startTimestamp = null;
        const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        cardConfirmed.querySelector(".value").innerHTML = Math.floor(progress*presentDayData.confirmed);
        cardActive.querySelector(".value").innerHTML = Math.floor(progress * (presentDayData.confirmed-(presentDayData.recovered+presentDayData.deceased)));
        cardRecovered.querySelector(".value").innerHTML = Math.floor(progress * presentDayData.recovered);
        cardDeath.querySelector(".value").innerHTML = Math.floor(progress * presentDayData.deceased);
        if (progress < 1) {
        window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
    lastUpdatedTime = allState[location].meta.last_updated.slice(0, 10)
  }

//***********It render all card's Changes***********//

const renderCardChange = function (location) {

    const duration = 500;
    previousDayData = timeseries[location].dates[`${pastDate()}`].total
    //To get active change data
    let activeChange =(presentDayData.confirmed - (presentDayData.recovered + presentDayData.deceased)) - (previousDayData.confirmed - (previousDayData.recovered + previousDayData.deceased))
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        cardConfirmed.querySelector(".change").innerHTML = `+${Math.floor(progress*(presentDayData.confirmed - previousDayData.confirmed))}`;
        cardActive.querySelector(".change").innerHTML = `${(activeChange >= 0 ? "+" : "-")}${Math.floor(progress * (activeChange))}`;
        cardRecovered.querySelector(".change").innerHTML = `+${Math.floor(progress*(presentDayData.recovered - previousDayData.recovered))}`;
        cardDeath.querySelector(".change").innerHTML = `+${Math.floor(progress*(presentDayData.deceased - previousDayData.deceased))}`;
        if (progress < 1) {
        window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);

}

//*******Update the chart *******/

const updateChart = function (location) {
    covidChartObject.data.datasets = []
    const dateList = Object.keys(timeseries[location].dates)
    const removeLastDate = dateList.pop()
    covidChartObject.data.labels = dateList
    if (chartState) {
        const data = {}
        data.label = chartState;
        data.data = [];
        if (chartState == "Active") {
            dateList.forEach(each => {
                const listPath = timeseries[location].dates[each].total
                data.data.push(listPath.confirmed-(listPath.recovered ?? 0+listPath.deceased ?? 0))
        })
        } else {
            dateList.forEach(each => {
                const listPath = timeseries[location].dates[each].total
                data.data.push(listPath[(chartState=="Death")?"deceased":chartState.toLowerCase()] ?? 0)
        })
        }
        let lineColor = null;
        let backgroundColor = null;
        switch (chartState) {
            case "Confirmed": {
                lineColor = getComputedStyle(cardsValue[0]).color;
                backgroundColor = getComputedStyle(cardConfirmed).backgroundColor
                }
                break;
            case "Active": {
                lineColor = getComputedStyle(cardsValue[1]).color;
                backgroundColor = getComputedStyle(cardActive).backgroundColor
            }
                
                break;
            case "Recovered": {
                lineColor = getComputedStyle(cardsValue[2]).color;
                backgroundColor = getComputedStyle(cardRecovered).backgroundColor
            }
                
                break;
            case "Death": {
                lineColor = getComputedStyle(cardsValue[3]).color;
                backgroundColor = getComputedStyle(cardDeath).backgroundColor
            }
                break;
            default:
                break;
        }
        data.backgroundColor = lineColor
        data.borderColor = lineColor
        covidChartObject.options.scales.yAxes[0].gridLines.color = lineColor
        covidChartObject.options.scales.xAxes[0].gridLines.color = lineColor
        covidChart.style.backgroundColor = backgroundColor
        data.fill = "none"
        data.pointRadius = "0"
        data.border = "2.5"
        data.pointHoverRadius = "3"
        covidChartObject.data.datasets.push(data);
    } else {
        covidChartObject.data.datasets = [
            {
                fill: 'none',
                backgroundColor: 'red',
                pointRadius: "0",
                borderColor: "red",
                borderWidth: "2.5",
                pointHoverRadius: "3"
            }, {
                fill: 'none',
                backgroundColor: 'rgb(0, 137, 216)',
                pointRadius: 0,
                borderColor: "rgb(0, 137, 216)",
                borderWidth: "2.5",
                pointHoverRadius: "3"
            }, {
                fill: 'none',
                pointRadius: 0,
                backgroundColor: "rgb(0, 133, 29)",
                borderColor: "rgb(0, 133, 29)",
                borderWidth: "2.5",
                pointHoverRadius: "3"
            }, {
                fill: 'none',
                pointRadius: 0,
                backgroundColor: "rgb(100, 100, 100)",
                borderColor: "rgb(100, 100, 100)",
                borderWidth: "2.5",
                pointHoverRadius: "3"
        }];
        
        const confirmedList = [];
        const activeList = [];
        const recoveredList = [];
        const deathList = [];
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
        covidChart.style.backgroundColor = "white"
        covidChartObject.options.scales.yAxes[0].gridLines.color = "rgb(170, 170, 170)"
        covidChartObject.options.scales.xAxes[0].gridLines.color = "rgb(170, 170, 170)"
    }
    covidChartObject.update();
}

//********** Active the cards************/

const activeCard = function (selectedCard) {
    if (selectedCard.style.transform == 'scale(1.05)') {
        allCards.forEach(card => {
            card.style.transform = 'scale(1)'
        })
        if (selectedStateName == "TT") {
            selectedState.querySelectorAll('path').forEach(state => {
                state.style.fill = "rgb(241,247,253)"
            })
        }
        stateBorder.style.stroke = 'rgba(0, 123, 255, 0.25)'
        chartState = null;
    } else {
        selectedCard.style.transform = 'scale(1.05)'
        allCards.forEach(card => {
            if (card != selectedCard) { card.style.transform = 'scale(0.95)' }
        })
        chartState = selectedCard.querySelector('.title').textContent
    }
    updateChart(selectedStateName)
    if (selectedStateName == "TT") {
        showDataOnMap()
    }
}

const showDataOnMap = function () {
    const list = []
    // console.log((chartState)?chartState.toLowerCase():"dece")
    // allState[each].total[(chartState)?chartState.toLowerCase():"active"]
    Object.keys(allState).forEach(each => {
        if (each == "TT")
            return
        switch (chartState) {
            case "Confirmed":
                list.push(allState[each].total.confirmed)
                break;
            case "Recovered":
                 list.push(allState[each].total[chartState.toLowerCase()])
                break;
            case "Active":
                list.push((allState[each].total.confirmed-(allState[each].total.recovered-allState[each].total.deceased)))
                break;
            case "Death":
                list.push(allState[each].total.deceased)
                    break;
            default:
                break;
        }
        
    })
    
    let [max, min]= [Math.max(...list),Math.min(...list)]
    // min = Math.min(...list)
    const eachState = document.querySelectorAll('.state')
    eachState.forEach(each => {
        const identifier = each.getAttribute('href')
        let stateValue = null //allState[identifier].total[(chartState)?chartState.toLowerCase():"active"]
        switch (chartState) {
            case "Confirmed":
                each.style.stroke = "none"
                stateValue = allState[identifier].total.confirmed
                let rgbValue = Math.floor(90-(((stateValue - min) * 50) / (max - min)))
                each.style.fill = `hsl(0,100%,${rgbValue}%)`
                break;
            case "Active":
                each.style.stroke = "none"
                stateValue = (allState[identifier].total.confirmed - (allState[identifier].total.recovered - allState[identifier].total.deceased))
                let rgbValue1 = Math.floor(90-(((stateValue - min) * 50) / (max - min)))
                each.style.fill = `hsl(211,100%,${rgbValue1}%)`
                break;
            case "Death":
                each.style.stroke = "none"
                stateValue = allState[identifier].total.deceased
                let rgbValue2 =(100 + Math.abs(100 - Math.floor((((stateValue - min) * 100) / (max - min)))))
                each.style.fill = `rgb(${rgbValue2},${rgbValue2},${rgbValue2})`
                break;
            case "Recovered":
                each.style.stroke = "none"
                stateValue = allState[identifier].total.recovered
                let rgbValue3 = Math.floor(90-(((stateValue - min) * 60) / (max - min)))
                each.style.fill = `hsl(150,70%,${rgbValue3}%)`
                break;
            default:
                break;
        }
    });
    switch (chartState) {
        case "Confirmed":
            stateBorder.style.stroke = 'rgb(255 117 117)'
            break;
        case "Active":
            stateBorder.style.stroke = 'rgb(76 175 232)'
            break;
        case "Recovered":
            stateBorder.style.stroke = 'rgb(44 191 76)'
            break;
        case "Death":
            stateBorder.style.stroke = 'rgb(136 136 136)'
                break;
        default:
            break;
    }
    

    // const list1 = []
    // Object.keys(allState).forEach(each => {
    //     if (each == "TT")
    //     return
    //     list1.push(allState[each].total.deceased)
    // })
}










//**********Fetch all card's data and render********//

const getStateValue = async function () {

    let stateLatestData = await (await fetch('https://api.covid19india.org/v4/min/data.min.json')).json()
    allState = stateLatestData;
    renderCardValue(selectedStateName)
    // showDataOnMap()
    const timeSeriesData = await (await fetch('https://api.covid19india.org/v4/min/timeseries.min.json')).json()
    timeseries = timeSeriesData
    renderCardChange(selectedStateName)
    activeCard(cardActive)
    

    // Map hover card's data change effect
    const indiaMapSvg = document.querySelector('.indiaMapSvg');
    indiaMapSvg.addEventListener('click', function (e) {
        e.preventDefault()
        if (e.target.classList.contains('state')) {
            selectedStateName = e.target.getAttribute('href')
            stateLabel.textContent = e.target.querySelector('title').textContent
            selectedState.querySelectorAll('path').forEach(state => {
                state.style.fill = "rgb(241,247,253)"
            })
            e.target.style.fill = "rgb(107 189 255)"
            stateBorder.style.stroke = 'rgba(0, 123, 255, 0.25)'
            renderCardValue(selectedStateName)
            renderCardChange(selectedStateName)
            updateChart(selectedStateName);
        } else {
            if (stateLabel.textContent != "India") {
                stateLabel.textContent = "India"
                selectedStateName = "TT"
                selectedState.querySelectorAll('path').forEach(state => {
                state.style.fill = "rgb(241,247,253)"
                })
                showDataOnMap()
                renderCardValue(selectedStateName)
                renderCardChange(selectedStateName)
                updateChart(selectedStateName);
                
            }
        }
    })

//**********All the EventListener for cards*********** */
    cardConfirmed.addEventListener('click', (e) => {
        activeCard(cardConfirmed)
    })
    cardActive.addEventListener('click', (e) => {
        activeCard(cardActive)
    })
    cardRecovered.addEventListener('click', (e) => {
        activeCard(cardRecovered)
    })
    cardDeath.addEventListener('click', (e) => {
        activeCard(cardDeath)
    })
}

getStateValue();


