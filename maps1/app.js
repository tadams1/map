var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var common = require('common');
var layers = require('./layers');
var cfg = require('./config')

var kml = require('./routes/kml');
var routes = require('./routes/index');
var mapview = require('./routes/mapview');
var users = require('./routes/users');
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
//layers.testsave();
//layers.addHTML();
// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/maps', maps);
app.use('/mapview', mapview);
app.use('/kml', kml);
app.use('/about', about);
app.use('/validator', validator);
app.use('/pageinfo', pageinfo);
module.exports = app;
