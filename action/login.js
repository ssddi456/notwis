var model = require('../model/model-users');
var async = require('async');
var configuration = require('../configuration');



module.exports = function login ( params, req, res ) {
  if( !params.username || !params.password ){
    res.json({err:'need count and pwd'});
    return;
  }

  var username = params.username;
  var password = params.password;

  async.waterfall([

    model.checkExist.bind(null,username),
    
    function(userid, callback){

      if(!userid){
        callback('username or password is not correct')
        return;
      }
      model.getUserAccount(userid,callback);

    },function(useraccount,callback){

      if(useraccount.password != password){
        callback('username or password is not correct')
        return;
      }
      callback(null, useraccount);

    },function(useraccount,callback){

      model.changeUserSession(useraccount.userid,callback);

    }],function(err,auth){

      if(err){
        res.json({error:err});
        return;
      }
      res.cookie('auth',auth,{ maxAge : configuration.sessionMaxAge })      
      res.json({sucess:auth});
      
    })
}