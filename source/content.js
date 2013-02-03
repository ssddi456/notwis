define([
],function() {

  var app         = {};
  app.curUser     = ko.observable(false);
  app.productInfo = ko.observable(false);

  var $req = new tools.request('notwis/');

  app.searchNumber   = ko.observable('');
  app.searchUserInfo = function(){
    var number = app.searchNumber();
    if( number == '' ){
      return
    } 
  }


  app.errorInfo    = ko.observable('');
  app.phoneWarning = ko.observable(false);
  app.phoneSuccess = ko.observable(false);
  
  app.searchNumber.subscribe(function(val){
    if( val== ''){
      app.phoneWarning(false);
      app.phoneSuccess(false);
      app.errorInfo('');
      return;
    }
    var error = false;
    if( val.length > 20 ){
      error = 'to long a phone number';
    }

    if( val.match(/[^\d]/) ){
      error = 'illegal character';
    }

    if(error){
      app.errorInfo(error);
      app.phoneWarning(true);
      app.phoneSuccess(false);
      return;
    }

    app.phoneWarning(false);
    app.phoneSuccess(true);
    app.errorInfo('success');
  })
  
  return app;
})