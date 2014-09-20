var server = io.connect(window.location.hostname);
server.on('error', function() {
  server.socket.connect();
});