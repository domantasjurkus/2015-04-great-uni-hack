var express = require('express');
var router = express.Router();

/* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Great Uni Hack' });
//});

/* GET GUH ship page. */
router.get('/', function(req, res) {
  res.render('game', { title: 'MLH Hacker Ship' })
});

module.exports = router;
