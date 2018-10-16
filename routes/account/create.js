var express = require('express');
var router = express.Router();
var request = require('request');
var commonFn = require('../../lib/common-functions');

router.post('/', function(req, res, next) {

  // set response type to json object
  res.setHeader(
    'Content-Type',
    'application/json'
  );

  // validations
  req
    .checkBody(
      "inputFirstName",
      "Please enter a valid first name."
    )
    .notEmpty()
    .isAlpha();
  req.checkBody(
      "inputLastName",
      "Please enter a valid last name."
    )
    .notEmpty()
    .isAlpha();
  req.checkBody(
      "inputEmail",
      "Please enter a valid email address."
    )
    .notEmpty()
    .isEmail();
  req.checkBody(
      "inputPassword",
      "Please enter a valid password."
    )
    .notEmpty();
  req.checkBody(
      "inputConfirmPassword",
      "Please enter a valid confirm password."
    )
    .notEmpty();
  req.checkBody(
      'inputConfirmPassword',
      'Passwords do not match.'
    )
    .equals(req.body.inputPassword);

  var errors = req.validationErrors();

  if(errors.constructor === Array){
    var errors = commonFn.eliminateDoubleErrors(errors);
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
  var backendUrl = host + '/account/add-api';
  var inputFirstName = req.body.inputFirstName;
  var inputLastName = req.body.inputLastName;
  var inputEmail = req.body.inputEmail;
  var inputPassword = req.body.inputPassword;
  var inputConfirmPassword = req.body.inputConfirmPassword;
  var selectAccountType = req.body.selectAccountType;

  var jsonData = {
    inputFirstName: inputFirstName,
    inputLastName: inputLastName,
    inputEmail: inputEmail,
    inputPassword: inputPassword,
    inputConfirmPassword: inputConfirmPassword,
    selectAccountType: selectAccountType
  };

  // call backend account registration API
  request.post({url: backendUrl, form: jsonData},
    function optionalCallback(err, httpResponse, body) {
    if (err) {
      return console.error('Error:', err);
    }
    var serverResponse = JSON.parse(body);

    // error processing here
    if (serverResponse.status === 'ok') {
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
  });
  return;
});

module.exports = router;