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
          data: [[time*1000 - 100*1000, 2.7],
                 [time*1000 - 90*1000, 2.9],
                 [time*1000 - 80*1000, 2.4],
                 [time*1000 - 70*1000, 2.3],
                 [time*1000 - 60*1000, 2.0],
                 [time*1000 - 50*1000, 2.1],
                 [time*1000 - 40*1000, 2.13],
                 [time*1000 - 30*1000, 2.07],
                 [time*1000 - 20*1000, 2.18],
                 [time*1000 - 10*1000, 2.02],
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