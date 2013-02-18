require([
  'ec', 'pages'
],function( 
  ec, pages
){
  
  var $view = $('#container');

  ec.on('loadpage',function( page ) {
    ko.cleanNode( $view[0] );
    $view.html( pages[page].render() );
    ko.applyBindings( pages[page] );
  })
  ec.fire('loadpage','login');
})()