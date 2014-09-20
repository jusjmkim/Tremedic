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