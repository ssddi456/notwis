var router = {};
var path = require('path');
var fs = require('fs');

router.welcome = 'index';

var actions = fs.readdirSync( path.join(__dirname,'action'));
actions.forEach(function(name) {
  router[name] = require('./action/'+path.basename(name,'.js') );
});

module.exports = router;