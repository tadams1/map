var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	// Connection URL
	// Use connect method to connect to the Server

    res.render('about');
});


module.exports = router;