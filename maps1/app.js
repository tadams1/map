var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var common = require('common');
var layers = require('./layers');
var cfg = require('./config');
var passwordless = require('passwordless');
var pMongoStore = require('passwordless-mongostore');
var email   = require("emailjs");
var session = require('express-session');
var sMongoStore = require('connect-mongo')(session);

var mapview = require('./routes/mapview');
var maps = require('./routes/maps');
var about = require('./routes/about');
var validator = require('./routes/validator');
var pageinfo = require('./routes/pageinfo');
var login = require('./routes/login');
var app = express();


var layers = new layers();

var pathToMongoDb = cfg.mongodb.url;
passwordless.init(new pMongoStore(pathToMongoDb));


var smtpServer  = email.server.connect({
   user: process.env.EMAIL_ACCOUNT,
   password: process.env.EMAIL_PWD,
   host: process.env.EMAIL_HOST,
   ssl:     true
});

passwordless.addDelivery(
    function(tokenToSend, uidToSend, recipient, callback) {
        var host = cfg.mapprefix;
        console.log("DELIVERY");
        smtpServer.send({
            text:    'Hello!\nAccess your account here: http://' 
            + host + '?token=' + tokenToSend + '&uid=' 
            + encodeURIComponent(uidToSend), 
            from:    'maptoken@ecocene.com.au', 
            to:      recipient,
            subject: 'Token for ' + host
        }, function(err, message) { 
            if(err) {
                console.log(err);
                console.log("DELIVERY");
        
            }
            callback(err);
        });
});

console.log("TestVal" + layers.testVal);

app.listen(cfg.listenport);
app.set('layers', layers)
layers.init('test1', 'pageinfo');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
    secret: process.env.SESSION_SECRET,    
    store: new sMongoStore({ url: cfg.mongodb.url })

}));

app.use(passwordless.sessionSupport());
app.use(passwordless.acceptToken({ successRedirect: '/pageinfo'}));

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
app.use('/login', login);
module.exports = app;
