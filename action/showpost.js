var modelUsers = require('../model/model-users');
var modelPosts = require('../model/model-posts');
var async = require('async');

module.exports = function( params, req, res ) {
  async.waterfall([
    modelUsers.checkLogin.bind(null,req.cookie.auth ),
    function(userid, callback) {
      
      modelPosts.getPosts(params.uid, params.start, params.count,callback);
      
    }],function(err, posts) {
      if(err){
        res.json(err);
        return;
      }
      res.json(posts);
    })
}