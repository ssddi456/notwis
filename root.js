var router = {};

router.welcome = 'index';
[ 'regist',
  'login',
  'logout'
].forEach(function(name) {
    router[name] = require('./action/'+name);
});

module.exports = router;

