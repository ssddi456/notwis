var modelUsers = require('../model/model-users');
var modelFollow = require('../model/model-follow');
var modelPosts = require('../model/model-posts');
var _ = require('underscore');
      
var async = require('async');

module.exports = function(params,req,res) {
  async.waterfall([
    modelUsers.checkLogin.bind(req.cookie.auth),
    modelUsers.getUserInfo,
    function(userinfo,callback) {
      modelFollow.getFollowInfo(userinfo.userid,function(err,res) {
        if( err ){ 
          callback(err);
          return;
        }
        callback(null,_.extend(userinfo,res));
      })
    }],function(err,res) {
      
      if(err){
        res.json(err);
        return;
      }

      res.json(res);

    })
}