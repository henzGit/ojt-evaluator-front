var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/', function(req, res, next) {

  // get cookie from request
  var cookies = req.cookies;

  // redirect to home page if there is no cookie
  if (!cookies.secret) {
    res.redirect('/');
    return;
  }

  var secret = cookies.secret;
  var id = cookies.id;

  // check if secret is valid (call to backend)
  var host = appConfig.backEnd.host;
  var port = appConfig.backEnd.port;
  var backendUrl = host + '/account/get-details-account';

  var jsonData = {
    id: id,
    secret: secret,
  };

  request.post({url: backendUrl, form: jsonData},
    function optionalCallback(err, httpResponse, bodyBackendResponse)
  {
    if (err) {
      return console.error('Error:', err);
    }

    if (bodyBackendResponse) {
      var serverResponse = JSON.parse(bodyBackendResponse);

      if(serverResponse.status === 'nok' ){
        // redirect to home page
        res.redirect('/');
      }

      // get details of mentee account
      var firstName = serverResponse.content.first_name;
      var lastName = serverResponse.content.last_name;
      var accountType = serverResponse.content.account_type;
      var partnerFirstName = serverResponse.otherData.partnerFirstName;
      var partnerLastName = serverResponse.otherData.partnerLastName;
      var phases = serverResponse.otherData.phases;
      var menteeId = serverResponse.content.mentee;

      // success case
      if(serverResponse.status === 'ok' && accountType === 2) {
        var jsonData  =
        {
          firstName: firstName,
          lastName: lastName,
          partnerFirstName: partnerFirstName,
          partnerLastName: partnerLastName,
          phases: phases,
          menteeId: menteeId,

        };
        res.render('account/welcome-mentor', jsonData);
      }
    }
  });
});

module.exports = router;