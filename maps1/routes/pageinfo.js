var express = require('express');
var router = express.Router();
var cfg = require('../config')
var ObjectID = require('mongodb').ObjectID;
var passwordless = require('passwordless');


/* GET users listing. */
router.get('/', passwordless.restricted(), function(req, res, next) {
	var layers = req.app.get('layers');
	var collection = layers.db.collection(cfg.mongodb.pageinfo);

	collection.find().toArray(function(e,docs){  
		console.log(JSON.stringify(docs));
		res.render('pageinfo', {pageinfo: JSON.stringify(docs)});
	});
});

router.post('/', passwordless.restricted(), function(req, res, next) {
	var layers = req.app.get('layers');
	var collection = layers.db.collection(cfg.mongodb.pageinfo);

	if(req.body.secretword != 'swiftparrot') {
		res.status(403);
		res.send({"result": "authorisation failed"});
		res.end();
	}

	if(req.body.action=='update'){
		collection.updateOne(
		{
			"_id": ObjectID.createFromHexString(req.body._id)
		},
		{
			$set: {
				"id": req.body.typeid,
				"text": req.body.text,
				"title": req.body.title,
				"type": req.body.type
			}
		}, function(err, results){
			layers.refreshPageInfo(layers);
		});
	} else if (req.body.action == 'delete') {
		collection.deleteOne(
		{
			"_id": ObjectID.createFromHexString(req.body._id)
		}, function(err, results){
			layers.refreshPageInfo(layers);
		});
	} else if (req.body.action == 'add') {
			collection.insertOne({
				"id": req.body.typeid,
				"text": req.body.text,
				"title": req.body.title,
				"type": req.body.type
			}
		, function(err, results){
			layers.refreshPageInfo(layers);
		});
	}
	console.log("DONE");
	res.status(200);
	res.send({"result": "success"});
	res.end();
});

module.exports = router;