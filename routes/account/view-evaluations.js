/**
 * Created by hendrik.hendrik on 12/8/16.
 */
var express = require('express');
var router = express.Router();
var request = require('request');
var redis = require("redis");
var commonFn = require('../../lib/common-functions');

router.get('/:id', function(req, res, next) {

    var inputMenteeId = req.params.id;

    // validations
    req.checkParams(
        "id",
        "Please enter a valid mentee id."
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

    var secret = cookies.secret;
    var id = cookies.id;

    // call to redis server
    var client = redis.createClient(process.env.REDIS_URL);

    client.on("error", function (err) {
        console.error("Error " + err);
    });

    var keyList = 'evaluated_phases_account' + inputMenteeId ;

    client.lrange( keyList, 0, -1,  function (err, listPhases)
    {
        // check if listPhases exist or not in Redis,
        // for first call the data do not exist and hence enter this thread
        if (listPhases.length === 0) {
            // if data do not exist in Redis, call backend
            // to get data and save data to Redis
            var host = appConfig.backEnd.host;
            var port = appConfig.backEnd.port;
            var backendUrl = host + '/account/get-details-account';

            var jsonData = {
                id: id,
                secret: secret,
                inputMenteeId: inputMenteeId
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

                    var partnerFullName = serverResponse.otherData.partnerFirstName
                      + ' '
                      + serverResponse.otherData.partnerLastName;

                    var phases = serverResponse.otherData.phases;

                    // clear list
                    client.del(keyList);

                    // loop over phases
                    for (var i=0; i<phases.length; i++) {
                        // clean start date
                        var startDateRaw = phases[i].start_date;

                        var startDate = commonFn.formatDate(startDateRaw);

                        // clean start date
                        phases[i].start_date = startDate;

                        // clean end date
                        var endDateRaw = phases[i].end_date;
                        var endDate = commonFn.formatDate(endDateRaw);

                        // clean end date
                        phases[i].end_date = endDate;

                        // save phase id to list
                        var hashKey = 'account'
                          + inputMenteeId
                          + '_phase'
                          + phases[i].id
                          + '_mentor';
                        client.rpush(keyList, hashKey);

                        // save details of each phase
                        client.hset(
                          hashKey,
                          "phase_name",
                          phases[i].name,
                          redis.print
                        );
                        client.hset(
                          hashKey,
                          "start_date",
                          phases[i].start_date,
                          redis.print
                        );
                        client.hset(
                          hashKey,
                          "end_date",
                          phases[i].end_date,
                          redis.print
                        );
                        client.hset(
                          hashKey,
                          "status",
                          phases[i].status,
                          redis.print
                        );
                        client.hset(
                          hashKey,
                          "mentee_name",
                          partnerFullName,
                          redis.print
                        );
                    }

                    client.quit();

                    var responseData = {
                        partnerFullName : partnerFullName,
                        phases : phases,
                    };

                    res.render('account/evaluations', responseData );
                    return;
                }
            });
        }

        // if dataRedis exists, render view
        if (listPhases.length > 0) {
            var phases = [];
            var partnerFullName = "";

            for (var i=0; i<listPhases.length; i++) {
                var hashKey = listPhases[i];

                client.hgetall(hashKey, function (err, phaseDetails) {
                    var phase = {
                        name: phaseDetails.phase_name,
                        start_date: phaseDetails.start_date,
                        end_date: phaseDetails.end_date,
                        status: phaseDetails.status,
                    };
                    // add phase to phases
                    phases.push(phase);
                    partnerFullName = phaseDetails.mentee_name;
                    var responseData = {
                        partnerFullName : partnerFullName,
                        phases : phases,
                    };

                    if (phases.length === listPhases.length) {
                        res.render('account/evaluations', responseData );
                        return;
                    }
                });
            }
        }
    });
});

module.exports = router;