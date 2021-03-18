const covidChart = document.querySelector(".covidChart")


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