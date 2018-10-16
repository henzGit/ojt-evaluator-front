// compulsory node modules
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

// set global variables
global.appRoot = path.resolve(__dirname);
global.viewPath = path.join(__dirname, 'views');

// routes for views (account)
global.viewCreateAccountRoute = '/account/view-create';
global.viewLoginAccountRoute = '/account/view-login';
global.welcomeMenteeAccountRoute = '/account/welcome-mentee';
global.welcomeMentorAccountRoute = '/account/welcome-mentor';
global.viewRegisterMentorRoute = '/account/view-register-mentor';
global.viewEvaluationsAccountRoute = '/account/view-evaluations';

// routes for views (phase)
global.viewAddPhaseRoute = '/phase/view-add';
global.viewEvaluatePhaseRoute = '/phase/view-evaluate';
global.viewEvaluationPhaseRoute = '/phase/view-evaluation';
global.viewTasksInPhaseRoute = '/phase/view-tasks';

// routes for views (task)
global.viewAddTaskRoute = '/task/view-add/phase';

// routes for API (account)
global.createAccountRoute = '/account/create';
global.loginAccountRoute = '/account/login';
global.logoutAccountRoute = '/account/logout';
global.registerMentorRoute = '/account/register-mentor';

// routes for API (phase)
global.addPhaseRoute = '/phase/add';
global.submitPhaseRoute = '/phase/submit';
global.evaluatePhaseRoute = '/phase/evaluate';

// routes for API (phase)
global.addTaskRoute = '/task/add/phase';

// config file
global.appConfig = require('./config/config.json');

// require routes for views
var indexJs = require('./routes/index');
var welcomeMenteeAccountJs = require('./routes' + welcomeMenteeAccountRoute);
var welcomeMentorAccountJs = require('./routes' + welcomeMentorAccountRoute);
var viewCreateAccountJs = require('./routes' + viewCreateAccountRoute);
var viewLoginAccountJs = require('./routes' + viewLoginAccountRoute);
var viewRegisterMentorJs = require('./routes' + viewRegisterMentorRoute);
var viewEvaluationsAccountJs = require('./routes' + viewEvaluationsAccountRoute);

var viewAddPhaseJs = require('./routes' + viewAddPhaseRoute);
var viewEvaluatePhaseJs = require('./routes' + viewEvaluatePhaseRoute);
var viewEvaluationPhaseJs = require('./routes' + viewEvaluationPhaseRoute);
var viewTasksInPhaseJs = require('./routes' + viewTasksInPhaseRoute);

var viewAddTaskJs = require('./routes' + '/task/view-add');

// require routes for API
var createAccountJs = require('./routes' + createAccountRoute);
var registerMentorJs = require('./routes' + registerMentorRoute);
var loginAccountJs = require('./routes' + loginAccountRoute);
var logoutAccountJs = require('./routes' + logoutAccountRoute);

var addPhaseJs = require('./routes' + addPhaseRoute);
var submitPhaseJs = require('./routes' + submitPhaseRoute);
var evaluatePhaseJs = require('./routes' + evaluatePhaseRoute);

var addTaskJs = require('./routes' + '/task/add');

////////////////////////////////////////////////////////////////
// Express APP Part
////////////////////////////////////////////////////////////////
// initialize app variable
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// Initialize app
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator()); // this line must be immediately after any of the bodyParser middlewares!
app.use(cookieParser());

// path for static html files
app.use(express.static(viewPath));

// list of app routes for views
app.use('/', indexJs);
app.use(welcomeMenteeAccountRoute, welcomeMenteeAccountJs);
app.use(welcomeMentorAccountRoute, welcomeMentorAccountJs);
app.use(viewCreateAccountRoute, viewCreateAccountJs);
app.use(viewLoginAccountRoute, viewLoginAccountJs);
app.use(viewRegisterMentorRoute, viewRegisterMentorJs);
app.use(viewEvaluationsAccountRoute, viewEvaluationsAccountJs);

app.use(viewAddPhaseRoute, viewAddPhaseJs);
app.use(viewEvaluatePhaseRoute, viewEvaluatePhaseJs);
app.use(viewEvaluationPhaseRoute, viewEvaluationPhaseJs);
app.use(viewTasksInPhaseRoute, viewTasksInPhaseJs);

app.use(viewAddTaskRoute, viewAddTaskJs);

// list of app routes for API
app.use(createAccountRoute, createAccountJs);
app.use(loginAccountRoute, loginAccountJs);
app.use(logoutAccountRoute, logoutAccountJs);
app.use(registerMentorRoute, registerMentorJs);

app.use(addPhaseRoute, addPhaseJs);
app.use(submitPhaseRoute, submitPhaseJs);
app.use(evaluatePhaseRoute, evaluatePhaseJs);

app.use(addTaskRoute, addTaskJs);

// import js and css libraries
app.use(
  '/js',
  express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect JS bootstrap
app.use(
  '/js',
  express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use(
  '/js',
  express.static(__dirname + '/node_modules/moment')); // redirect JS moment
app.use(
  '/js',
  express.static(__dirname + '/node_modules/bootstrap/js')); // redirect JS moment
app.use(
  '/css',
  express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

module.exports = app;