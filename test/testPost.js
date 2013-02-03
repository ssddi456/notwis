
var db = require('../db');
var modelPosts = require('../model-posts');

var async = require('async');
async.series([
  function( callback ){

    modelPosts.newPost('1','test words',function(err, resp ) {
      console.log( 'new post', err, resp );
      callback( err, resp );
    });

  },
  function( callback ){

    modelPosts.getPosts(-1,null,null,function( err, resp ){
      console.log( 'get globel time line', err, resp );
      callback( err, resp );
    });

  }
],function(err, params){
  console.log( 'finish', err, params);
  process.exit(0);
});