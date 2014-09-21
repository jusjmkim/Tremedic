/** Socket.io Functionality **/

var server = io.connect(window.location.hostname);
server.on('error', function() {
  server.socket.connect();
});

function listenForStats() {
  server.on('frequency', function(data) {
    console.log(data);
  });
}

function listenForPreviousData() {
  server.on('previousData', function(data) {
  var previousData = JSON.parse(data);
  });
}

(function() {
  listenForStats();
  listenForPreviousData();
})();

/** Chart Functionality **/

$(function () {
  var time = (new Date()).getTime();
  $('#chart-frequency').highcharts('StockChart', {

      rangeSelector: {
          inputEnabled: $('#chart-frequency').width() > 480,
          selected: 1
      },

      title: {
          text: 'Mean Tremor Frequency (Hz)'
      },

      series: [{
          name: 'Tremor Frequency',
          data: [[time - 10*1000, 2.7],
                 [time - 10*1000, 2.9],
                 [time - 10*1000, 2.4],
                 [time - 10*1000, 2.3],
                 [time - 10*1000, 2.0],
                 [time - 10*1000, 2.1],
                 [time - 10*1000, 2.13],
                 [time - 10*1000, 2.07],
                 [time - 10*1000, 2.18],
                 [time - 10*1000, 2.02],
                 [time - 10*1000, 1.98],
                 [time - 10*1000, 1.97],
                ]
          type: 'spline',
      }]
  });
});

$(function () {
    $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=msft-c.json&callback=?', function (data) {

        // Create the chart
        $('#chart-magnitude').highcharts('StockChart', {

            rangeSelector: {
                inputEnabled: $('#chart-magnitude').width() > 480,
                selected: 1
            },

            title: {
                text: 'Mean Tremor Magnitude (°/sec)'
            },

            series: [{
                name: 'Tremor Magnitude',
                data: data,
                type: 'spline',
            }]
        });
    });
});