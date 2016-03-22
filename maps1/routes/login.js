var express = require('express');
var router = express.Router();
var cfg = require('../config')
var passwordless = require('passwordless');


router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/', passwordless.requestToken(function(user, delivery, callback, req) 
    {
        var layers = req.app.get('layers');
        var collection = layers.db.collection(cfg.mongodb.users);
        
        collection.find().toArray(function(e,docs){
            console.log(JSON.stringify(docs));
            for (var i = docs.length - 1; i >= 0; i--) {
                if(docs[i].email === user.toLowerCase()) {
                    console.log(docs[i].email);
                    return callback(null, docs[i]._id);
                }
            }
            callback(null, null);
        });
    }),
    function(req, res) {
        // success!
        res.render('sent');
});


module.exports = router;