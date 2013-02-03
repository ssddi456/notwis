define([
],function() {

  function loginModule ( req ){
    this.username = ko.observable('');
    this.password = ko.observable('');
    
    this.login    = function(){
      
      req.post('login',{
        username        : this.username(),
        password        : this.password()
      },function( res ){
        console.log( res );
      })
    };
    this.regist   = function(){
      
    }
  }
  return loginModule;    
})