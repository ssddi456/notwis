var modelUsers  = require('../model/model-users');
var modelFollow = require('../model/model-follow');
var async       = require('async');

module.exports = function(params,req,res) {
  async.waterfall([
    modelUsers.checkLogin.bind(req.cookie.auth),
    function( userid, callback ) {
      modelFollow.unfollow(userid,params.uid,callback)
    }],function(err,res) {
      
      if(err){
        res.json(err);
        return;
      }

      res.json(res);

    })
}