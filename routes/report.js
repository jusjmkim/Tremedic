var express = require('express');
var http = require('http');
var router = express.Router();

/* GET patient report. */
router.get('/1', function(req, res) {
  res.render('report', {title: 'Report'});
});

module.exports = router;
