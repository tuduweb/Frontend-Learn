var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/recorder', function(req, res, next) {
  res.render('recorder');
  
  console.log(res.query);
});


router.get('/socket', function(req, res, next) {
  res.render('socket');
  console.log(res.query);
});

router.get('/live', function(req, res, next) {
  res.render('live', { title: 'Express' });
  console.log(res.query);
});

module.exports = router;
