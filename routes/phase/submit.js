var express = require('express');
var router = express.Router();
var request = require('request');

router.post('/', function(req, res, next) {

    // set response type to json object
    res.setHeader('Content-Type', 'application/json');

    // validations
    req.checkBody("inputPhaseId", "Please enter a valid phase id.")
      .notEmpty()
      .isNumeric();

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
    if(!cookies.secret) {
        res.redirect('/');
        return;
    }

    var secret = cookies.secret;
    var id = cookies.id
    var host = appConfig.backEnd.host;
    var port = appConfig.backEnd.port;
    var backendUrl = host + '/phase/submit';
    var inputPhaseId = req.body.inputPhaseId;
    var jsonData = {
        inputPhaseId: inputPhaseId,
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
                res.redirect('/account/welcome-mentee');
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
