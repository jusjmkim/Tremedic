/** Socket.io Functionality **/

var server = io.connect(window.location.hostname);
server.on('error', function() {
  server.socket.connect();
});

function listenForStats() {
  server.on('rotationStats', function(data) {
  var rotationStats = JSON.parse(data);
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
    $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=aapl-c.json&callback=?', function (data) {

        // Create the chart
        $('#chart').highcharts('StockChart', {

            rangeSelector: {
                inputEnabled: $('#chart').width() > 480,
                selected: 1
            },

            title: {
                text: 'AAPL Stock Price'
            },

            series: [{
                name: 'AAPL Stock Price',
                data: data,
                type: 'spline',
                tooltip: {
                    valueDecimals: 2
                }
            }]
        });
    });
});
