var express = require('express');
var router = express.Router();
var request = require('request');
var redis = require("redis");

router.post('/', function(req, res, next) {
    // set response type to json object
    res.setHeader('Content-Type', 'application/json');

    // validations
    req.checkBody("inputPhaseId", "Please enter a valid phase id.")
      .notEmpty()
      .isNumeric();
    req.checkBody("selectPhaseStatus", "Please enter a valid phase status.")
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
    var backendUrl = host + '/phase/evaluate';
    var inputPhaseId = req.body.inputPhaseId;
    var selectPhaseStatus = req.body.selectPhaseStatus;
    var jsonData = {
        id: id,
        secret: secret,
        inputPhaseId: inputPhaseId,
        selectPhaseStatus: selectPhaseStatus,
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
                // delete data from redis
                var menteeId = serverResponse.content.account_id;
                var keyList = 'evaluated_phases_account' + menteeId ;
                var client = redis.createClient(process.env.REDIS_URL);

                // clear list
                client.del(keyList);

                // normal processing here
                res.redirect('/account/welcome-mentor');
                return;
            } else {
                var responseToFront = {
                    msg : serverResponse.msg,
                    code: serverResponse.code,
                    content: serverResponse.content
                };
                res.status(400).send(responseToFront);
                return;
            }
        }
    });
});

module.exports = router;