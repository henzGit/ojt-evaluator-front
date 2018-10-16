/**
 * Created by hendrik.hendrik on 12/8/16.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

    // clear all cookies
    res.clearCookie("id");
    res.clearCookie("secret");

    // redirect to home page
    res.redirect('/');
});

module.exports = router;
