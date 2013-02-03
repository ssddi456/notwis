define([],function() {
  // abstract function;
  var nf = function(){};
  // global eventcenter;
  window.ec = window.ec || {};
  // list cache;
  var list = {};

  var g_paused = false;

  // namespace separater;
  function namespacefilter (type){
    if(list[type] === undefined){
      list[type] = $.Callbacks('memory');
    }
    return list[type];
  }
  ec.fire = function(type) {
    if(g_paused){
      return;
    }
    var data = Array.prototype.slice.call(arguments,1);
    var namespace = namespacefilter(type);
    namespace.fire.apply(namespace,data);
  };

  ec.on   = function( type, handle ) {
    var namespace = namespacefilter(type);
    namespace.add.apply(handle);
  };

  ec.unbind=function(type, handle){

    var namespace = namespacefilter(type);
    if(handle){
      namespace.remove.apply(handle);
    } else {
      namespace.empty();
    }
  };

  function OrderEvent (types,process,_final) {
    this.types   = types;
    this.process = process;
    this._final  = _final;

    this.index   = 0;
    this.laststamp=0;
    this.timeout = 500;
    var listen = this.listen.bind(this);
    this._listen = listen;

    types.forEach(function( type ) {
      ec.on(type, listen);
    });
  }
  var oeproto = OrderEvent.prototype;

  oeproto.listen = function( e ){
    // type match current type
    // time not out
    // got go
    if( e.timestamp > this.laststamp+this.timeout){
      this.index = 0;
    }

    if(e.type == this.types[this.index]){
      this.index++;
      this.laststamp = e.timestamp;
      this.process.apply(this,arguments);
    } else{
      return;
    }

    if( this.index >= this.types.length ){
      this._final.apply(this,arguments);
      this.index = 0;
      this.laststamp = 0;
    }
  }
  oeproto.unbind= function(){
    var listen = this._listen;
    this.types.forEach(function(type){
      ec.unbind(type,listen)
    });
  }
  ec.order= function( types, process, _final) {
    if(arguments.length=2){
      _final = process;
      process= nf;
    }
    var ordered = new OrderEvent(types,process,_final);
    
  };
  
  ec.once = function(type, handle){
    function wrap(){
      handle.apply(this,arguments);
      ec.unbind(type,wrap);
    }
    ec.on(type,wrap);
  };
  ec.ready= function(type, handle){
    var namespace = namespacefilter(type);
    if( namespace.fired() ){
      var n = false;
      function wrap (){
        if(!n){
          n = true;
          return;
        }
        handle.apply(this,arguments);
      }
      ec.on(type, wrap);
    } else {}
  };
  ec.pause= function(namespace){
    if(namespace==undefined){
      ec.fire('pause');
      g_paused = true;
      return;
    }
  }
  ec.resume=function(namespace){
    if(namespace==undefined){
      g_paused = false;
      ec.fire('resume');
      return;
    }
  }
})