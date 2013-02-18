var pages = ['login','regist','welcome']

define(pages.map(function(page) {
  return 'pages/'+page;
}),function(
  
){
  var req   = new tools.request('notwis/');
  var ret = {};
  var args= arguments;

  pages.forEach(function( page, i ){
  
    ret[page] = new args[i]( req );
    ret[page].render = jade.compile($('#'+page).text());
  
  });

  return ret;
});