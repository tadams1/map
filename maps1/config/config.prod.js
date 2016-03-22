var config = module.exports = {};
 
config.env = 'prod';
config.mapprefix = 'http://map.birdlife.org.au'

//mongo database
config.mongodb = {};
config.mongodb.url = 'mongodb://skzm:Phone123@ds047095.mongolab.com:47095/skzmbird';
config.mongodb.col = 'mapdata';
config.mongodb.pageinfo = 'pageinfo';
config.mongodb.users = 'users';
config.listenport = 8000;