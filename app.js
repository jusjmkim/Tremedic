//require dependencies
var express = require('express')
    , path = require('path')
    , favicon = require('serve-favicon')
    , cookieParser = require('cookie-parser')
    , bodyParser = require('body-parser')
    , socket = require('socket.io')
    , http = require('http')
    , mongoose = require('mongoose')
    , Rotation = require('./models/models').Rotation
    , Slope = require('./models/models').Slope
    , dotenv = require('dotenv')
    , twilio = require('twilio')
    , port = process.env.PORT || 8080
    , app = express();

dotenv.load();
var sendgrid = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD)

var server = http.createServer(app);
var io = socket.listen(server);

var mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost/parkinsons';
mongoose.connect(mongoUri);
var conn = mongoose.connection;

var frequency = 0;

//Listen to client
function openClientConnection() {
  io.sockets.on('connection', function(client) {
    listenToClient(client);
    queryForPreviousData(client);
  });
}

function listenToClient(client) {
  listenForData(client);
  listenToSendEmail(client);
  listenToSendText(client);
}

function listenForData(client) {
  client.on('data', function(data) {
    parseGyroscopeData(client, data);
  });
}

//access database
function queryForPreviousData(client) {
  Rotation.find(function(err, rotations) {
    if (err) return console.error(err);
    sendPreviousData(client, rotations);
  });
}

function sendPreviousData(client, data) {
  client.emit('previousData', JSON.stringify(data));
}

function insertToRotationDatabase(data) {
  var newRotation = new Rotation(data);
  newRotation.save(data);
}

function insertToSlopeDatabase(data) {
  var newSlope = new Slope(data);
  newSlope.save(data);
}

function insertToDatabase(rotation, slope) {
  insertToRotationDatabase(rotation);
  insertToSlopeDatabase(slope);
}

//analyze data
function parseGyroscopeData(client, gyroscopeData) {
  calculateChange(gyroscopeData);
  setFrequencyInterval(client);
}

function setFrequencyInterval(client) {
  setTimeout(function() {
    sendFrequency(client);
    frequency = 0;
  }, 10000);
}

function sendFrequency(client) {
  client.emit('frequency', frequency / 10.0);
}

function calculateChange(gyroscopeData) {
  var lastGyroscopeData = findLastData('Rotation');
  var currentSlope = gyroscopeData - lastGyroscopeData;
  incrementFrequency(compareSlopes(currentSlope, findLastData('Slope')));
  insertToDatabase(gyroscopeData, currentSlope);
}

function compareSlopes(currentSlope, pastSlope) {
  return (currentSlope > 0 && pastSlope > 0) || (currentSlope < 0 && pastSlope);
}

function incrementFrequency(extrema) {
  if (!extrema) { frequency++; }
}

function findLastData(collection) {
  var lastData;
  conn.collection(collection).findOne({}, {}, {sort:{'created_at': -1}}, function(err, data) {
    lastData = err ? 0 : data;
  });
  return lastData;
}

//send email
function listenToSendEmail(client) {
  client.on('sendEmail', function() {
    setupSendgrid();
  });
}

function setupSendgrid() {
  var email = new sendgrid.Email({
    to: 'nitsuj199@gmail.com',
    from: 'hello@tremedic.com',
    subject: 'Please check your Tremedic',
    text: "One of your Parkinson's patients has had a change in his tremor rate, and you should view his data."
  });

  sendEmail(email);
}

function sendEmail(email) {
  sendgrid.send(email, function(err, json) {
    if (err) {console.error(err);}
    console.log(json);
  });
}

//send text messages
function listenToSendText(client) {
  client.on('sendText', function() {
    setupTwilio();
  });
}

function setupTwilio() {
  var client = new twilio.RestClient(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  sendTwilio(client);
}

function sendTwilio(client) {
  client.sms.messages.create({
    to: '2016321315',
    from: process.env.TWILIO_NUMBER,
    body: 'Remember to put on your Myo!'
  }, function(error, message) {
    if (error) {console.log("There was an error");}
  });
}

//Set up app
function requireRoutes() {
  require('./routes/routes.js')(app);
}

function configureViews() {
  // view engine setup
  app.set('views', path.join(__dirname, 'views'));

  // uncomment after placing your favicon in /public
  app.use(favicon(__dirname + '/public/images/favicon.ico'));
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
  requireRoutes();
  configureViews();
  listenToServer();
}

(function() {
  setupApp();
  openClientConnection();
})();