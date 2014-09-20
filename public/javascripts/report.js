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

function queryForPreviousData() {
  server.emit('previousData', {});
}

function listenForPreviousData() {
  server.on('previousData', function(data) {
    var previousData = JSON.parse(data);
  });
}

(function() {
  listenForStats();
  queryForPreviousData();
  listenForPreviousData();
})();

/** Myo Functionality **/

var getTime = function() {
  var ms = new Date().getTime();
  return parseInt(ms / 1000);
} 

var gyroscopeData, accelerometerData;

Myo.start();

Myo.on('imu', function(data){

  timestamp = getTime();

  gyroscopeData = {
    x: data.gyroscope.x,
    y: data.gyroscope.y,
    z: data.gyroscope.z,
    time: timestamp
  };

  accelerometerData = {
    x: data.accelerometer.x,
    y: data.accelerometer.y,
    z: data.accelerometer.z,
    time: timestamp
  };

});

setInterval(function(){
  console.log(gyroscopeData);
  console.log(accelerometerData);
}, 500);