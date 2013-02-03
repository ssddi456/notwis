var db = require('./db');
var async = require('async');
var modelFollow = require('./model-follow');

var posts = module.exports;

posts.newPost = function( userid, content, cb ) {
  var postid;
  async.waterfall([
    function( callback ){
      // get uid of post
      db.incr('global:nextPostId',callback);

    },function( _postid, callback ){

      console.log('postid', _postid);
      // create store content
      postid = _postid;
      content = userid + "|" + Date.now() + "|" + content.replace('\n',' ');
      db.set('uid:'+postid, content, callback);

    },

    modelFollow.getFollowers.bind(null,userid),

    function(followers,callback){

      if(!followers){ followers = []}
      followers.push(userid);

      console.log('followers', followers);
      // add this post to all followers
      var cmdlist = [];
      followers.forEach(function(user){
        cmdlist.push(['lpush', "uid:"+user+":posts", postid ]);
      });
      cmdlist.push(['lpush', "uid:"+user+":postout", postid ]);
      console.log('followers', cmdlist);
      // add to post list
      db.multi(cmdlist).exec(callback);

    },function( resp, callback){

      console.log('post pushed', resp);
      // change timeline
      db.multi([
        ['lpush', "global:timeline", postid],
        ['ltrim', "global:timeline", 0, 1000]
      ]).exec(callback);

    }],

    cb);
}


posts.getPosts = function( userid, start, count, callback ) {

  var postlist;

  if( userid == -1 ) {
    postlist = 'global:timeline';
  } else {
    postlist = "uid:"+userid+":posts";
  }

  // init pages
  if( !start ){
    start = 0;
  }
  if( !count ){
    count = 20;
  }
  console.log('normalize parames', postlist, start, count );
  // get postids
  db.lrange(postlist, start, start+count,function(err,list){

    if(err){
      callback(err);
      return;
    }
    console.log( 'postids', list );
    // fetch real content
    db.mget( list.map(function(postid){
      return 'uid:'+postid;
    }), callback);

  });
}
posts.getPostCount =function(userid,cb){
  db.llen('uid:'+userid+':postout')
}