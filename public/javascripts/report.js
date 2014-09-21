/** Socket.io Functionality **/

var server = io.connect(window.location.hostname);
server.on('error', function() {
  server.socket.connect();
});

function listenForPreviousData() {
  server.on('previousData', function(data) {
  var previousData = JSON.parse(data);
  });
}

(function() {
  // listenForFrequency();
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
          data: [[new Date(time - 100*1000), 2.7],
                 [new Date(time - 90*1000), 2.9],
                 [new Date(time - 80*1000), 2.4],
                 [new Date(time - 70*1000), 2.3],
                 [new Date(time - 60*1000), 2.0],
                 [new Date(time - 50*1000), 2.1],
                 [new Date(time - 40*1000), 2.13],
                 [new Date(time - 30*1000), 2.07],
                 [new Date(time - 20*1000), 2.18],
                 [new Date(time - 10*1000), 2.02],
                ],
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