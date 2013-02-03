var db    = require('./db');
var async = require('async');
var _     = require('underscore');
var tools = require('../tools');



var model = module.exports;

model.getNewUserId = function(cb){
  db.incr('global:nextUserId',cb);
}

model.checkLogin = function( auth, cb ) {
  async.waterfall([
    function(callback){
      // check auth exist
      db.get('auth:'+auth,function(err,userid){
        if(err){
          callback(err);
          return;
        }
        if(!userid){
          callback('expired');
          return;
        }
        callback(null, userid)
      })

    },function(userid,callback){
      // compare authkey
      db.get('uid:'+userid+':auth',function(err,_auth){
        if(err){
          callback(err);
          return;
        }
        if(_auth != auth){
          callback('keynotpair');
          return;
        }
        callback(null, userid);
      });

    }],
    
    // final callback
    cb)
}

model.getUserAccount = function(userid,cb){
  db.mget([
    'uid:'+userid+':username',
    'uid:'+userid+':password'
    ],function(err, resp){
    if(err){
      callback(err);
      return;
    }
    var useraccount = _.object(['userid','username','password'],[userid].concat(resp));
    cb(null,useraccount);
  });
};

model.getUserInfo = function(userid,cb){
  db.get('uid:'+userid+':username',function(err, username){
    if(err){
      callback(err);
      return;
    }

    callback(null,{userid:userid,username:username});
  })
};

model.checkExist = function(username,cb){
  db.get('username:'+username+':id',function(err,userid){
    if(err){
      cb(err);
      return;
    }
    cb(null,userid);
  })
};

model.newUser = function( username, password, cb ){
  var userid;
  async.waterfall([

    model.getNewUserId,

    function(_userid,callback){

      userid = _userid;

      db.mset([
        'username:'+ username +':id', userid,
        'uid:'     + userid + ':username'  , username,
        'uid:'     + userid + ':password'  , password
      ],callback);

    },function(){

      db.sadd('global:users', userid,function(err){
        if(err){
          cb(err);
          return;
        }
        cb(null, userid);
      });

    }],cb)
  
};

model.changeUserSession = function( userid, cb ){
  var auth = tools.uuid();
  db.mset([
    'uid:'     + userid + ':auth' , auth,
    'auth:'    + auth             , userid
  ],function(err){

    if(err){
      cb(err);
      return
    }
    cb(null, auth);

  });
};

model.destroySession = function( auth, userid, cb ){
  async.waterfall([
    function( callback ){

      model.changeUserSession(userid,function(err, newauth ){
        if(err){
          callback(err);
          return;
        }

        callback(null);
      })

    },function(callback){

      db.del('auth:'+auth,callback);
      
    }],
    cb)
};