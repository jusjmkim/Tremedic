module.exports = function(app) {
  app.use(function(req, res, next) {
    next();
  });

  app.get('/', function(req, res) {
    res.render('login.html');
  });

  app.get('/live', function(req, res) {
    res.render('live.html')
  });

  app.get('/report', function(req, res) {
    res.render('report.html')
  });
};