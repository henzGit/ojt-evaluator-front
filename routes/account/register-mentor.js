/**
 * Created by hendrik.hendrik on 12/7/16.
 */
var express = require('express');
var router = express.Router();
var request = require('request');

router.post('/', function(req, res, next) {

    // get selected mentor id
    var selectMentorId = req.body.selectMentorId;

    // set response type to json object
    res.setHeader('Content-Type', 'application/json');

    // validations
    req.checkBody(
        "selectMentorId",
        "Please ensure that the mentor exists.")
      .notEmpty();

    var errors = req.validationErrors();

    // error management
    if (errors) {
        var responseToFront = {
            msg : "validaton error(s) in the front-end",
            code: 0,
            content: errors
        };
        res.status(400).send(responseToFront);
        return;
    }

    // get cookie from request
    var cookies = req.cookies;

    // redirect to home page if there is no cookie
    if (!cookies.secret) {
        res.redirect('/');
        return;
    }

    var secret = cookies.secret;
    var id = cookies.id;
    var host = appConfig.backEnd.host;
    var port = appConfig.backEnd.port;
    var backendUrl = host + '/account/register-mentor';

    var jsonData = {
        secret: secret,
        id: id,
        selectMentorId: selectMentorId
    };

    // call backend account registration API
    request.post({url: backendUrl, form: jsonData},
      function optionalCallback(err, httpResponse, body) {
        if (err) {
            return console.error('Error:', err);
        }
        var serverResponse = JSON.parse(body);

        // redirect to welcome page regardless of the server response
        res.redirect('/account/welcome-mentee');
    });
    return;
});

module.exports = router;