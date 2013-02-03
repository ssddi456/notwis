var redis = require('redis');
var configuration = require('../configuration');


var db = module.exports =  redis.createClient( configuration.redisPortal, configuration.redisHost );

db.on('connect',function() {
  console.log('redis connected');
});