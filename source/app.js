require([
  'ec',
  'login',
  'regist',
  'content'
],
function( login, regist, content ){
  var req = new tools.request('notwis/');

  ko.applyBindings(new login(req),  $('.panel-login')[0] );
  ko.applyBindings(new regist(req), $('.panel-regist')[0] );
  ko.applyBindings(content, $('.panel-content')[0] );


})()