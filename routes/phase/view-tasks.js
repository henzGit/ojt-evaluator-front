/**
 * Created by hendrik.hendrik on 12/8/16.
 */
var express = require('express');

var router = express.Router();
var request = require('request');
var commonFn = require('../../lib/common-functions');

router.get('/:id', function(req, res, next) {
    var inputPhaseId = req.params.id;

    // validations
    req.checkParams(
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
    if (!cookies.secret) {
        res.redirect('/');
        return;
    }

    var secret = cookies.secret
    var id = cookies.id

    // check if secret is valid (call to backend)
    var host = appConfig.backEnd.host;
    var port = appConfig.backEnd.port;
    var backendUrl = host + '/phase/get-details-phase';
    var jsonData = {
        id: id,
        secret: secret,
        inputPhaseId: inputPhaseId
    };

    request.post({url: backendUrl, form: jsonData},
      function optionalCallback(err, httpResponse, body)
    {
        if (err) {
            return console.error('Error:', err);
        }

        if (body) {
            var serverResponse = JSON.parse(body);

            // error processing here
            if (serverResponse.status === 'nok') {
                var responseToFront = {
                    msg : serverResponse.msg,
                    code: serverResponse.code,
                    content: serverResponse.content
                };
                res.status(400).send(responseToFront);
            }

            var phaseId = serverResponse.content.id;
            var phaseName = serverResponse.content.name;
            var startDateRaw = serverResponse.content.start_date;
            var startDate = commonFn.formatDate(startDateRaw);
            var endDateRaw = serverResponse.content.end_date;
            var endDate = commonFn.formatDate(endDateRaw);
            var tasks = serverResponse.otherData.tasks;

            // format date for tasks
            for (var i=0; i<tasks.length; i++) {
                tasks[i].start_date = commonFn.formatDate(tasks[i].start_date);
                tasks[i].end_date = commonFn.formatDate(tasks[i].end_date);
            }

            var responseData  = {
                phaseId : phaseId,
                phaseName : phaseName,
                startDate : startDate,
                endDate : endDate,
                tasks: tasks
            };

            res.render('phase/view-tasks', responseData);
            return;
        }
    });
});

module.exports = router;