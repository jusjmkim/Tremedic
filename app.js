var express = require('express')
    , path = require('path')
    , favicon = require('serve-favicon')
    , cookieParser = require('cookie-parser')
    , bodyParser = require('body-parser')
    , url = require('url')
    , socket = require('socket.io')
    , http = require('http')
    , mongoose = require('mongoose')
    , Rotation = require('./models/models').Rotation
    , port = process.env.PORT || 8080
    , router = express.Router()
    , app = express();

var server = http.createServer(app);
var io = socket.listen(server);

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/parkinsons';

function openClientConnection() {
  io.sockets.on('connection', function(client) {
    sendRotation(client);
    listenToClient(client);
  });
}

function listenToClient(client) {
  
}

function sendRotation(client) {

}

function connectDatabase() {
  mongoose.connect(mongoUri);
}

function requireRoutes() {
  //create routes
  require('./routes/routes.js')(app);
}

function configureViews() {
  // view engine setup
  app.set('views', path.join(__dirname, 'views'));

  // uncomment after placing your favicon in /public
  //app.use(favicon(__dirname + '/public/favicon.ico'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.set('view engine', 'ejs');
  app.engine('html', require('ejs').renderFile);
}

function listenToServer() {
  server.listen(port);    
}

function setupApp() {
  connectDatabase();
  requireRoutes();
  configureViews();
  listenToServer();
}

(function() {
  setupApp();
  openClientConnection();
})();