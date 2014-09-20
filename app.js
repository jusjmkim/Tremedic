var express = require('express')
    , path = require('path')
    , favicon = require('serve-favicon')
    , cookieParser = require('cookie-parser')
    , bodyParser = require('body-parser')
    , url = require('url')
    , socket = require('socket.io')
    , http = require('http')
    , port = process.env.PORT || 8080
    , router = express.Router()
    , app = express();

require('./routes/routes.js')(app);

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

var server = http.createServer(app);
var io = socket.listen(server);

function listenToServer() {
  server.listen(port);    
}

(function() {
  listenToServer();
})();