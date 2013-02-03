var db = require('../db');

db.set('uid:some', 'some',function(err, resp){
  console.log( err, resp );

  process.exit(0);
})