/** Socket.io Functionality **/

var server = io.connect(window.location.hostname);
server.on('error', function() {
  server.socket.connect();
});

function listenForFrequency() {
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
  listenForFrequency();
  listenForPreviousData();
})();

/** Myo Functionality **/

var gyroscopeData = {x: 0, time:0};
var gyroscopeHistory = [];
var dataInterval = 100; // milliseconds

function getTime() {
  var ms = new Date().getTime();
  return ms / 1000;
} 

function sendDataToServer() {
  server.emit('data', {'gyroscopeData': gyroscopeData});
}

Myo.start();

Myo.on('imu', function(data){
  // On new inertial measurement unit value
  // Get current gyroscope & accelerometer values

  gyroscopeData = {
  x: data.gyroscope.x,
  time: getTime()
  };

  // Save points to history
  gyroscopeHistory.push(gyroscopeData);
});

// Send data to server every specified milliseconds
setInterval(sendDataToServer, dataInterval);

/** Chart Functionality **/

$(function () {
  Highcharts.setOptions({
    global : {
      useUTC : true
    }
  });

  // Create the chart
  $('#chart').highcharts('StockChart', {
    chart : {
      events : {
        load : function () {
          // set up the updating of the chart each second
          var series = this.series[0];
          setInterval(function () {
            var x = (new Date()).getTime();
            var y = gyroscopeData.x;
            series.addPoint([x, y], true, true);
          }, 100);
        }
      }
    },

    rangeSelector: {
      buttons: [{
        count: 10,
        type: 'second',
        text: '10s'
      }, {
        count: 30,
        type: 'second',
        text: '30s'
      }, {
        type: 'all',
        text: 'All'
      }],
      inputEnabled: false,
      selected: 0
    },

    title : {
      text : 'Current Tremor Magnitude (°/sec)'
    },

    exporting: {
      enabled: false
    },

    series : [{
      name : 'Tremor Magnitude',
      data : (function () {
        // generate an array of random data
        var data = [];
        var time = (new Date()).getTime();

        for (var i = -999; i <= 0; i += 1) {
          data.push([
            time + i * 1000,
            Math.round(Math.random() * 300)
          ]);
        }

        return data;
      }()),
      type: 'spline'
    }]
  });
});
