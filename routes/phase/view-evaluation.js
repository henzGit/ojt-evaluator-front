/**
 * Created by hendrik.hendrik on 12/8/16.
 */
var express = require('express');

var router = express.Router();
var request = require('request');
var redis = require("redis");
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

    // call to redis server
    var client = redis.createClient(process.env.REDIS_URL);

    client.on("error", function (err) {
        console.error("Error " + err);
    });

    var hashKey = 'account' + id + '_phase' + inputPhaseId;

    client.hgetall(hashKey, function (err, dataRedis) {
        // if dataRedis exists, render view
        if(dataRedis){
            var jsonResponse = {
                phaseName: dataRedis.phase_name,
                startDate: dataRedis.start_date,
                endDate: dataRedis.end_date,
                mentorName: dataRedis.mentor_name,
                status: dataRedis.status,

            };
            res.render('phase/evaluation', jsonResponse);
            return
        }

        // if data do not exist in Redis, call backend to get data and save data to Redis
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
                if(serverResponse.status === 'nok') {
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
                var status = serverResponse.content.status;
                var mentorName = '';

                // get account details of mentee
                var backendUrl = host + '/account/get-details-account';
                var jsonData = {
                    id: id,
                    secret: secret,
                };

                request.post({url: backendUrl, form: jsonData},
                  function optionalCallback(err, httpResponse, body) {
                    if(body){
                        var serverResponse = JSON.parse(body);

                        mentorName = serverResponse.otherData.partnerFirstName
                          + ' '
                          + serverResponse.otherData.partnerLastName;

                        var responseData  = {
                            phaseName : phaseName,
                            startDate : startDate,
                            endDate : endDate,
                            status : status,
                            mentorName : mentorName
                        };

                        // save data to redis
                        client.hset(hashKey, "phase_name", phaseName, redis.print);
                        client.hset(hashKey, "start_date", startDate, redis.print);
                        client.hset(hashKey, "end_date", endDate, redis.print);
                        client.hset(hashKey, "mentor_name", mentorName, redis.print);
                        client.hset(hashKey, "status", status, redis.print);

                        // client.quit();
                        res.render('phase/evaluation', responseData );
                    }
                });
            }
        });
    });
});

module.exports = router;