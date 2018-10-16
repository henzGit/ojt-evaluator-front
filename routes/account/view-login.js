var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('account/login');
});

module.exports = router;
