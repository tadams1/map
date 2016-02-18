var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	// Connection URL
	// Use connect method to connect to the Server

    var layers = req.app.get('layers');
    console.log('in request')
    console.log("Req:" + layers.strPoints);
    console.log("PI" + layers.pageInfo);
    res.render('mapview', { view : "'" + req.query.view + "'", pageInfo: layers.pageInfo});
});

router.post('/', function(req, res, next) {
    var layers = req.app.get('layers');
 	layers.savePointer(req.body)
	console.log(req.body);
});

module.exports = router;