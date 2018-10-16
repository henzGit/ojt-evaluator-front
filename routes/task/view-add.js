/**
 * Created by hendrik.hendrik on 12/8/16.
 */
var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/:id', function(req, res, next) {
    var inputPhaseId = req.params.id;

    // validations
    req
      .checkParams(
        "id",
        "Please enter a valid phase id."
      )
      .notEmpty()
      .isNumeric();

    var errors = req.validationErrors();

    // error management
    if (errors) {
        // set response type to json object
        res.setHeader('Content-Type', 'application/json');

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
    if(!cookies.secret){
        res.redirect('/');
        return;
    }

    var secret = cookies.secret;
    var id = cookies.id

    var host = appConfig.backEnd.host;
    var port = appConfig.backEnd.port;
    var backendUrl = host + '/phase/get-details-phase';

    var jsonData = {
        id: id,
        secret: secret,
        inputPhaseId: inputPhaseId
    };

    // call backend account registration API
    request.post({url: backendUrl, form: jsonData},
      function optionalCallback(err, httpResponse, body)
    {
        if (err) {
            return console.error('Error:', err);
        }

        if(body) {
            var serverResponse = JSON.parse(body);

            // error processing here
            if(serverResponse.status === 'ok'){
                // normal processing here
                var dataResponse = {
                    phaseName: serverResponse.content.name,
                    phaseId: serverResponse.content.id,

                };
                res.render('task/add', dataResponse);
                return;
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
});

module.exports = router;