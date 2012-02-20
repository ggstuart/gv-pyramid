var buildings = [
    {id: 15, padded_id: '0015', label: 'Campus Centre'},
    {id: 69, padded_id: '0069', label: 'IOCT'},
    {id: 111, padded_id: '0111', label: 'Kimberlin library'},
    {id: 213, padded_id: '0213', label: 'Queens building'},
    {id: 490, padded_id: '0490', label: 'Hugh Aston Building'}
];

$(document).ready(function() {
    for (var i = 0; i < buildings.length; i++) {
        buildings[i].chart_data = loadChartData(buildings[i]);
        buildings[i].current = getCurrentReading(buildings[i].chart_data);
        console.log(buildings[i].label + " is " + buildings[i].current);
        update_chart(buildings[i]);
    }
});

function getCurrentReading(data) {
    var upper = data.upper.pop();
    var lower = data.lower.pop();
    var value = data.value.pop();
    if (value > upper) {
        return 'bad';
    } else if (value < lower) {
        return 'good';
    } else {
        return 'neutral';
    }
}

function loadChartData(bldg) {
    return loadJSON("/meter/" + bldg.id + "/chart.json");
}

function loadProfile(bldg) {
//    return loadJSON("http://greenview.ecoconsulting.co.uk/data/profile_" + bldg_id + ".json");
    return loadJSON("/static/data/profile_" + bldg.padded_id + ".json");
}

function loadData(bldg) {
//    return loadJSON("http://greenview.ecoconsulting.co.uk/data/data_" + bldg_id + ".json");
    return loadJSON("/meter/" + bldg.id + "/latest_week.json");
}

function loadJSON(sURL) {
    var ajax = new XMLHttpRequest();
    ajax.open( "GET", sURL, false );
    ajax.setRequestHeader("Content-type", "application/json");
    ajax.send(null);
    if (ajax.readyState===4 && (ajax.status===200||ajax.status===0)) {
        return JSON.parse(ajax.responseText);
    }
    else {
        alert("Error executing XMLHttpRequest call! [url: " + sURL + ", status: " + ajax.status + "]");
    }
}

function update_chart(bldg) {
    var options = {
        chart: {
            renderTo: 'graph',
            zoomType: 'x',
            defaultSeriesType: 'areaspline',
            borderWidth: 0,
            borderRadius: 0,
            // height: 393,
            spacingTop: 2,
            spacingLeft: 2,
            spacingRight: 16,
            backgroundColor: '#fff'
        },
        title: {
            text: bldg.label + ' electricity consumption'
        },
        legend: {
            layout: 'horizontal',
            align: 'center',
//            x: 80,
            y: -60,
            floating: true,
            borderWidth: 1//,
//            backgroundColor: Highcharts.theme.legendBackgroundColor || '#FFFFFF'
        },
        xAxis: {
            type: 'datetime',
            maxZoom: 24 * 3600000, // one day
            title: {
                text: 'time'
            },
            labels: {
                rotation: -72, // -6 (horizontal) if inverted: true
                align: 'right'
            }
        },
        yAxis: {
            title: {
                text: 'Consumption (kWh)'
            }
        },
        tooltip: {
            formatter: function() {
                d = new Date(this.x);
                return ''+
                d +': '+ this.y +' Kwh';
            }
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            areaspline: {
                fillOpacity: 1.0,
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: true,
                            radius: 10
                        }
                    }
                }
            },
            line: {
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: true,
                            radius: 10
                        }
                    }
                }
            }
        }
    };
    var startd = new Date(bldg.chart_data.datetime[0]);
    var start = startd.getTime();
    options.series = [
        {
            name: 'More than average',
            pointInterval: 60 * 30 * 1000,
            pointStart: start,
            data: bldg.chart_data.upper,
            color: 'rgba(213, 68, 68, .5)',
            threshold: 149,
            fillColor: 'rgba(213, 68, 68, .1)',
            lineColor: 'rgba(193, 48, 48, .6)',
            linewidth: 1
        },
        {
            name: 'Actual energy use',
            pointInterval: 60 * 30 * 1000,
            pointStart: start,
            type: 'line',
            data: bldg.chart_data.value,
            color: 'rgba(33, 33, 33, .9)',
            borderWidth: 0,
            borderRadius: 4,
            pointPadding: 0,
            groupPadding: 0.1
        },
        {
            name: 'Less than average',
            pointInterval: 60 * 30 * 1000,
            pointStart: start,
            data: bldg.chart_data.lower,
            color: 'rgba(68, 213, 68, .9)',
            fillColor: 'rgba(68, 213, 68, .1)',
            lineColor: 'rgba(68, 213, 68, .6)'
        }
    ];
    var chart = new Highcharts.Chart(options);
}

