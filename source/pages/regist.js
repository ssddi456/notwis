define([
  'ec'
],function( 
  ec

){
  function registModule ( req ){
    this.username = ko.observable('');
    this.password = ko.observable('');
    this.password2= ko.observable('');
    this.regist   = function(){
      
      req.post('regist',{
        username : this.username(),
        password : this.password(),
        password2: this.password2()
      },function(res){
        console.log(res);
      })

    };
    this.login  = function() {
      ec.fire('loadpage','login');
    }
  }
  return registModule;    

})