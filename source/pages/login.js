define([
],function() {

  function loginModule ( req ){
    this.username = ko.observable('');
    this.password = ko.observable('');
    
    this.login    = function(){
      
      req.post('login',{
        username        : this.username(),
        password        : this.password()
      },function( err, res ){
        if( err ){
          console.log( err );
        }
        ec.fire('loadpage','welcome');
      });

    };

    this.regist   = function(){
      ec.fire('loadpage','regist');
    }

  }
  return loginModule;    
})