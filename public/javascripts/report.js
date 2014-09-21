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

/** Myo Functionality **/

var gyroscopeData = {};
var accelerometerData = {};
var dataInterval = 100; // milliseconds

function getTime() {
  var ms = new Date().getTime();
  return ms / 1000;
} 

function sendDataToServer() {
  console.log(gyroscopeData);
  console.log(accelerometerData);
  server.emit('data', {'gyroscopeData': gyroscopeData, 
                       'accelerometerData': accelerometerData});
}

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

setInterval(sendDataToServer, dataInterval);