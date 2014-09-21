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
          data: [[time - 10000000*1000, 2.7],
                 [time - 9000000*1000, 2.9],
                 [time - 8000000*1000, 2.4],
                 [time - 7000000*1000, 2.3],
                 [time - 6000000*1000, 2.0],
                 [time - 5000000*1000, 2.1],
                 [time - 4000000*1000, 2.13],
                 [time - 3000000*1000, 2.07],
                 [time - 2000000*1000, 2.18],
                 [time - 1000000*1000, 2.02],
                ],
          type: 'spline',
      }]
  });
});

$(function () {
  var time = (new Date()).getTime();

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
        data: [[time - 10000000*1000, 85],
                 [time - 9000000*1000, 85],
                 [time - 8000000*1000, 85],
                 [time - 7000000*1000, 85],
                 [time - 6000000*1000, 85],
                 [time - 5000000*1000, 85],
                 [time - 4000000*1000, 85],
                 [time - 3000000*1000, 85],
                 [time - 2000000*1000, 85],
                 [time - 1000000*1000, 85],
                ],
        type: 'spline',
    }]
  });
});