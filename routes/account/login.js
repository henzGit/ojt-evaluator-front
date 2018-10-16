var express = require('express');
var router = express.Router();
var request = require('request');

function eliminateDoubleErrors(errors){
  var outputErrors = [];
  var inputKeys = {};

  for (var i=0; i<errors.length; i++) {
    var key = errors[i].param;

    if(!(key in inputKeys)){
      inputKeys[key] = true;
      outputErrors.push(errors[i]);
    }
  }
  return outputErrors;
}

router.post('/', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');

  // validations
  req.checkBody(
      "inputEmail",
      "Please enter a valid email address.")
    .notEmpty()
    .isEmail();
  req.checkBody(
      "inputPassword",
      "Please enter a valid password.")
    .notEmpty();

  var errors = req.validationErrors();
  if(errors.constructor === Array){
    var errors = eliminateDoubleErrors(errors);
  }

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

  var host = appConfig.backEnd.host;
  var port = appConfig.backEnd.port;
  var backendUrl = host + '/account/login-api';
  var inputEmail = req.body.inputEmail;
  var inputPassword = req.body.inputPassword;

  var jsonData = {
    inputEmail: inputEmail,
    inputPassword: inputPassword,
  };

  // call backend account registration API
  request.post({url: backendUrl, form: jsonData},
    function optionalCallback(err, httpResponse, body) {

    if (err) {
      return console.error('Error:', err);
    }
    if(body){
      var serverResponse = JSON.parse(body);

      // error processing here
      if(serverResponse.status === 'ok'){
        var secret = serverResponse.secret;
        var id = serverResponse.content.id;

        // normal processing here
        var responseToFront = {
          msg : serverResponse.msg,
          content : serverResponse.content,
          secret : secret,
          otherData : serverResponse.otherData
        };

        // set cookie
        res.cookie('secret', secret , { maxAge: 900000, httpOnly: true });
        res.cookie('id', id , { maxAge: 900000, httpOnly: true });
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