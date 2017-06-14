var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var passport = require("passport");
var session = require("express-session");
var flash = require("connect-flash");
var cookieSession = require('cookie-session');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

// Database
var mongoose = require('mongoose');
mongoose.connect('mongodb://ecotrip:ecotrip1234@ds115701.mlab.com:15701/ecotrip');

// Routes
var index = require('./routes/index');
var api = require('./routes/api');
var auth = require('./routes/auth');
var admin = require('./routes/admin');
var agent = require('./routes/agent');
var userauth= require('./routes/userauth');
var recomend= require('./routes/recomend');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieSession({
  name: 'session',
  keys: ['12kj3gh1k24gk3g2k12h3gh'],
 
  // Cookie Options 
  maxAge: 60 * 60 * 60 * 1000 // 24 hours 
}));

app.use(session({
  secret: "secret",
  saveUninitialized: true,
  resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

// In this example, the formParam value is going to get morphed into form body format useful for printing.
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(flash());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

app.use('/', index);
app.use('/auth', auth);
app.use('/api', api);
app.use('/admin', admin);
app.use('/agent', agent);
app.use('/api/auth',userauth);
app.use('/api/recomend',recomend);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
