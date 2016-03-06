var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var common = require('common');
var layers = require('./layers');
var cfg = require('./config');


var mapview = require('./routes/mapview');
var maps = require('./routes/maps');
var about = require('./routes/about');
var validator = require('./routes/validator');
var pageinfo = require('./routes/pageinfo');
var app = express();

var layers = new layers();

console.log("TestVal" + layers.testVal);

app.listen(cfg.listenport);
app.set('layers', layers)
layers.init('test1', 'pageinfo');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/*passport.use(new GoogleStrategy({
    returnURL: cfg.realm + '/pageinfo',
    realm: cfg.realm
  },
  function(identifier, profile, done) {
    User.findOrCreate({ openId: identifier }, function(err, user) {
      done(err, user);
    });
  }
));

app.get('/auth/google', passport.authenticate('google'));
app.get('/auth/google/return',
  passport.authenticate('google', { successRedirect: '/config/pageinfo',
                                    failureRedirect: '/mapview' }));*/
app.use('/maps', maps);
app.use('/mapview', mapview);
app.use('/about', about);
app.use('/validator', validator);
app.use('/pageinfo', pageinfo);
module.exports = app;
