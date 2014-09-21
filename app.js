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

//Listen to client
function openClientConnection() {
  io.sockets.on('connection', function(client) {
    listenForData(client);
    queryForPreviousData(client);
  });
}

function listenForData(client) {
  client.on('data', function(data) {
    //parseGyroscopeData(client, JSON.parse(data));
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

function insertToDatabase(data) {
  var newRotation = new Rotation(data);
  newRotation.save(data);
  findFirstData();
}

function findFirstData() {
  Rotation.find(function(err, data) {
    console.log(data);
  });
}

//analyze data
function parseGyroscopeData(client, gyroscopeData) {
  calculateChange(gyroscopeData);
  var rotation; //define with analysis
  checkForChange(rotation);
  sendRotationData(client);
  //insertToDatabase(rotation);
}

function checkForChange(rotation) {
  if (thereIsChange(rotation)) {
    setupSendgrid();
  }
}

function thereIsChange(rotation) {
  
}

function sendRotationData(client) {
  var data = {

  };
  client.emit('rotationStats', JSON.stringify(data));
}

function calculateChange(gyroscopeData) {
  var gyroscopeDataX = gyroscopeData.x;
  var lastGyroscopeData = findLastGyroscopeData();
  var currentSlope = gyroscopeDataX - lastGyroscopeData;

}

function findLastGyroscopeData() {
  var lastGyroscopeData;
  conn.collection('Rotation').findOne({}, {}, {sort:{'created_at': -1}}, function(err, data) {
    if (err) {
      lastGyroscopeData = 0;
    } else {
      lastGyroscopeData = data;
    }
  });
  return lastGyroscopeData;
}

//send email
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