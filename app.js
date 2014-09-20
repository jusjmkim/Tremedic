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
    , dotenv = require('dotenv')
    , twilio = require('twilio')
    , port = process.env.PORT || 8080
    , router = express.Router()
    , app = express();

dotenv.load();

var server = http.createServer(app);
var io = socket.listen(server);

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/parkinsons';

function openClientConnection() {
  io.sockets.on('connection', function(client) {
    listenToClient(client);
  });
}

function listenToClient(client) {
  listenForPreviousData(client);
  listenForAccelerationData(client);
}

function listenForPreviousData(client) {
  client.on('previousData', function() {
    queryForPreviousData(client);
  });
}

function queryForPreviousData(client) {
  Rotation.find(function(err, rotations) {
    if (err) return console.error(err);
    sendPreviousData(client, rotations);
  });
}

function sendPreviousData(client, data) {
  client.emit('previousData', JSON.stringify(data));
}

function listenForAccelerationData(client) {
  client.on('acceleration', function(data) {
    parseAcceleration(client, data);
  });
}

function parseAcceleration(client, acceleration) {
  var rotation; //define with analysis
  checkForChange(rotation);
  sendRotationData(client);
  persistRotationData(rotation);
}

function checkForChange(rotation) {
  if (thereIsChange(rotation)) {
    setupSendgrid();
  }
}

function thereIsChange(rotation) {

}

function setupSendgrid() {
  var sengrid = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENGRID_PASSWORD);

  var payload = {
    to: '',
    from: 'hello@tremedic.com',
    subject: 'Please check your Tremedic',
    text: "One of your Parkinson's patients has had a change in his tremor rate, and "
  };

  sendEmail(sengrid, payload);
}

function sendEmail(sendgrid, payload) {
  sendgrid.send(payload, function(err, json) {
    if (err) {console.error(err);}
    console.log(json);
  });
}

function sendRotationData(client) {
  var data = {

  };
  client.emit('rotationStats', JSON.stringify(data));
}

function persistRotationData(rotationNumber) {
  var rotation = new Rotation({rotation: Number});
  rotation.save();
}

function sendTwilio() {
  var client = new twilio.RestClient(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  client.sms.message.create({
    to: '',
    from: process.env.TWILIO_NUMBER,
    body: 'Remember to put on your Myo!'
  }, function(error, message) {
    if (error) {console.log("There was an error");}
  });
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