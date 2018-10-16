var express = require('express');
var router = express.Router();
var request = require('request');
var commonFn = require('../../lib/common-functions');

router.post('/', function(req, res, next) {
    // set response type to json object
    res.setHeader('Content-Type', 'application/json');

    // validations
    req.checkBody("inputPhaseName", "Please enter a valid phase name.")
      .notEmpty()
      .isAlphanumeric();
    req.checkBody("inputStartDate", "Please enter a valid start date.")
      .notEmpty()
      .isDate();
    req.checkBody("inputEndDate", "Please enter a valid end date.")
      .notEmpty()
      .isDate();

    var errors = req.validationErrors();

    if (errors.constructor === Array) {
        var errors = commonFn.eliminateDoubleErrors(errors);
    }

    var inputStartDate = req.body.inputStartDate;
    var inputEndDate = req.body.inputEndDate;

    // validations for start and end date
    errors = commonFn.validateInputDates(inputStartDate, inputEndDate, errors);

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
    var id = cookies.id
    var host = appConfig.backEnd.host;
    var port = appConfig.backEnd.port;
    var backendUrl = host + '/phase/add-api';
    var inputPhaseName = req.body.inputPhaseName;
    var jsonData = {
        inputPhaseName: inputPhaseName,
        inputStartDate: inputStartDate,
        inputEndDate: inputEndDate,
        id: id,
        secret: secret,
    };

    // call backend account registration API
    request.post({url: backendUrl, form: jsonData},
      function optionalCallback(err, httpResponse, body)
    {
        if (err) {
            return console.error('Error:', err);
        }
        if (body) {
            var serverResponse = JSON.parse(body);

            // error processing here
            if(serverResponse.status === 'ok') {
                // normal processing here
                var responseToFront = {
                    msg : "no error during parameters validation"
                };
                res.json(responseToFront);
            } else {
                var responseToFront = {
                    msg : serverResponse.msg,
                    code: serverResponse.code,
                    content: serverResponse.content
                };
                res.status(400).send(responseToFront);
            }
        }
    });
    return;
});

module.exports = router;
