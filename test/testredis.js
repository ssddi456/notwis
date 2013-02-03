var model = require('../model');
var db = require('../db');


model.checkExist('123',function(err, userid) {
  db.mget([
    'uid:'     + userid + ':username',
    'uid:'     + userid + ':password',
    'uid:'     + userid + ':auth'
  ],function(err,rslt){
    console.log(err, rslt);
  });
});
