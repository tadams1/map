var express = require('express');
var router = express.Router();
var cfg = require('../config')
var ObjectID = require('mongodb').ObjectID;
var passwordless = require('passwordless');


router.get('/', passwordless.restricted(), function(req, res, next) {
    var layers = req.app.get('layers');
    var collection = layers.db.collection(cfg.mongodb.users);

    collection.find().toArray(function(e,docs){  
        console.log(JSON.stringify(docs));
        res.render('users', {users: JSON.stringify(docs)});
    });
});

router.post('/', passwordless.restricted(), function(req, res, next) {

    var layers = req.app.get('layers');
    var collection = layers.db.collection(cfg.mongodb.users);

   if (req.body.action == 'delete') {
        collection.deleteOne(
        {
            "_id": ObjectID.createFromHexString(req.body._id)
        }, function(err, results){
        });
    } else if (req.body.action == 'add') {
            collection.insertOne({
                "email": req.body.emailaddr
            }
        , function(err, results){
        });
    }
    console.log("DONE");
    res.status(200);
    res.send({"result": "success"});
    res.end();
});


module.exports = router;