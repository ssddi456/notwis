var db = require('./db');


var follow = module.exports;


follow.getFollowers = function( userid, cb) {
  db.smembers( 'uid:'+ userid +':followers',cb);
};
follow.getFollowings = function( userid,cb){
  db.smembers( 'uid:'+ userid +':followings',cb);
};
follow.getFollowerCount = function( userid,cb ){
  db.scard( 'uid:'+ userid +':followers',cb);
};
follow.getFollowingCount = function( userid,cb ){
  db.scard( 'uid:'+ userid +':followerings',cb);
};

follow.getFollowInfo = function(userid,cb){
  db.multi([
      ['smembers','uid:'+ userid +':followers'],
      ['smembers','uid:'+ userid +':followings']
    ]).exec(function(err,res){
      if(err){
        cb(err);
        return;
      }
      var ret = {
        followers  : res[0],
        followings : res[1]
      }
      cb(null, ret);
    });
}
follow.follow = function ( userid, followingid, cb ){
  db.multi([
    ['sadd', 'uid:'+ userid      + ':followers', followingid],
    ['sadd', 'uid:'+ followingid + ':followings',userid]
  ]).exec(cb);
};
follow.unfollow=function(userid,followingid,cb){
  db.multi([
    ['srem', 'uid:'+ userid      + ':followers', followingid],
    ['srem', 'uid:'+ followingid + ':followings',userid]
  ]).exec(cb);
};