var async         = require('async');
var modelUsers    = require('../model/model-users');
var configuration = require('../configuration');

module.exports = function regist ( params, req, res ) {
  if ( ( !params.username || !params.password || !params.password2 ) || 
       ( params.password != params.password2 )
    ){
    res.json({error:"Every field of the registration form is needed!"});
    return;
  }
  var username = params.username;
  var password = params.password;

  async.waterfall([
    function(callback){
      model.checkExist(username,function(err,userid){
        if (err){
          callback(err);
          return;
        }
        if( userid ){
          callback('user exist');
          return;
        }
        callback(null);
      })
    },

    model.newUser.bind( null, username, password),

    model.changeUserSession,

    function(auth, callback){

      res.cookie('auth', auth,{ maxAge: configuration.sessionMaxAge });
      callback(null);

    }],

    function (err, result) {
      if(err){
        res.json({error:err});
        return;
      }
      res.json({success:'end'});
    });
};