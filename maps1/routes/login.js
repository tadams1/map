var express = require('express');
var router = express.Router();
var cfg = require('../config')
var passwordless = require('passwordless');


router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/', 
    passwordless.requestToken(


        function(user, delivery, callback) {
        var users = [
    { id: 1, email: 'tadams1@gmail.com' }];
            for (var i = users.length - 1; i >= 0; i--) {
                if(users[i].email === user.toLowerCase()) {
                    return callback(null, users[i].id);
                }
            }
            callback(null, null);
        }),
        function(req, res) {
            // success!
        res.render('sent');
});


module.exports = router;