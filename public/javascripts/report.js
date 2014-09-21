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
  listenForFrequency();
  listenForPreviousData();
})();

/** Chart Functionality **/

$(function () {
  // Create the chart
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
          data: [],
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