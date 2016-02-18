var express = require('express');
var xmlparser = require('express-xml-bodyparser');
var tj = require('togeojson')
var DOMParser = require('xmldom').DOMParser;
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	// Connection URL
	// Use connect method to connect to the Server
    var layers = req.app.get('layers');
    res.render('kml', { pageInfo: layers.pageInfo});
});

router.post('/', xmlparser({trim: false, explicitArray: false}), function(req, res, next) {
    var layers = req.app.get('layers');
 	console.log("Body1:" + req.rawBody);
 	var dom = (new DOMParser()).parseFromString(req.rawBody, 'text/xml');
    var converted = tj.kml(dom);
 	res.sendStatus(200);
});

module.exports = router;
