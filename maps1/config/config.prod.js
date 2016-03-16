var config = module.exports = {};
 
config.env = 'prod';
config.mapprefix = 'http://103.18.108.126'

//mongo database
config.mongodb = {};
config.mongodb.url = 'mongodb://skzm:Phone123@ds047095.mongolab.com:47095/skzmbird';
config.mongodb.col = 'mapdata';
config.mongodb.pageinfo = 'pageinfo';
config.listenport = 8000;