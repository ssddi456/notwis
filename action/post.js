var modelPosts = require('../model/model-posts');
var modelUsers = require('../model/model-users');
var async = require('async');

module.exports = function(params, req, res) {
  async.waterfall([
    modelUsers.checkLogin.bind(null,req.cookie.auth),
    function( userid,callback ) {
    
      modelPosts.newPost( userid, params.content,callback)
        
    }],function(err, res) {
      if(err){
        res.json(err);
        return;
      }
      res.json(success);
    })
}