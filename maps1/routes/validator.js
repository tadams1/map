var express = require('express');
var router = express.Router();
var cfg = require('../config')
var ObjectID = require('mongodb').ObjectID;


/* GET users listing. */
router.get('/', function(req, res, next) {
	var layers = req.app.get('layers');
	var collection = layers.db.collection(cfg.mongodb.col);

  var clause = {"properties.validated": false};
  collection.find(clause).toArray(function(e,docs){ 
    res.render('validator', {records: JSON.stringify(docs)});
  });
});

router.post('/', function(req, res, next) {
  var layers = req.app.get('layers');
  var collection = layers.db.collection(cfg.mongodb.col);
  console.log(req.body.valid.length);

  for(var i=0; i<req.body.valid.length; i++) {
    console.log("Validated" + req.body.valid[i]);
    collection.updateOne(
    {
      "_id": ObjectID.createFromHexString(req.body.valid[i])
    },
    {
      $set: {
        "properties.validated": true
      }
    }, function(err, results){
      console.log(results);
    });
  }

  for(var i=0; i < req.body.invalid.length;i++) {

    console.log("Deleting" + req.body.valid[i]);
    collection.deleteOne(
    {
      "_id": ObjectID.createFromHexString(req.body.invalid[i])
    }, function(err, results){
      console.log(results);
    });
  } 

  console.log("DONE");
  res.status(200);
  res.send({"result": "success"});
  res.end();
});


module.exports = router;