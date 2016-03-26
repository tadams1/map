var config = module.exports = {};
 
config.env = 'development';
config.hostname = 'dev.example.com';
config.mapprefix = 'http://192.168.1.112:3000/'
config.realm = 'http://192.168.1.112:3000//config/'

//mongo database
config.mongodb = {};
config.mongodb.url = 'mongodb://localhost:27017/BirdMap';
config.mongodb.col = 'MapData';
config.mongodb.pageinfo = 'pageinfo';
config.mongodb.users = 'users';
config.listenport = 3001;
