var express = require('express');
var router = express.Router();
var request = require('request');
var cookieParser = require('cookie-parser')

router.get('/', function(req, res, next) {

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
    var backendUrl = host + '/account/get-available-mentors';

    var jsonData = {
        secret: secret,
        id:id
    };

    // extract params
    request.post({url: backendUrl, form: jsonData},
      function optionalCallback(err, httpResponse, bodyBackendResponse) {
        if (err) {
            return console.error('Error:', err);
        }

        var availableMentors = [];
        var serverResponse = JSON.parse(bodyBackendResponse);

        // success case
        if (serverResponse.status === 'ok') {
            // get a list of available mentors
            var availableMentors = serverResponse.content;
        }

        res.render(
          'account/register-mentor',
              {
                  'availableMentors': availableMentors
              }
          );
    });
});

module.exports = router;