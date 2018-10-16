/**
 * Created by hendrik.hendrik on 12/8/16.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('phase/add');
});

module.exports = router;