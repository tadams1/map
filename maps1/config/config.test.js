var config = module.exports = {};
 
config.env = 'development';
config.hostname = 'dev.example.com';
config.mapprefix = 'http://www.ecocene.com.au/map'

//mongo database
config.mongodb = {};
config.mongodb.url = 'mongodb://skzm:Phone123@ds047095.mongolab.com:47095/skzmbird';
config.mongodb.col = 'test1';
config.listenport = 49500;