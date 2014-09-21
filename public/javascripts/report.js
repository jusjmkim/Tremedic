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
          data: [[times - 100s, 2.7],
                 [times - 90s, 2.9],
                 [times - 80s, 2.4],
                 [times - 70s, 2.3],
                 [times - 60s, 2.0],
                 [times - 50s, 2.1],
                 [times - 40s, 2.13],
                 [times - 30s, 2.07],
                 [times - 20s, 2.18],
                 [times - 10s, 2.02],
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