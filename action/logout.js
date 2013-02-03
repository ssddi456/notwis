var model = require('../model/model-users');
var async = require('async');


module.exports = function logout ( params, req, res ) {

  var auth = req.cookies.auth;
  async.waterfall([

    model.checkLogin.bind(null, auth),

    model.destroySession.bind(null,auth)
    
    ],function(err){
      if(err){
        res.json({error:err});
        return;
      }

      res.clearCookie('auth');
      res.json({ 'success' : 'logout' });
    });
}