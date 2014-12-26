
(function(factory) {
  'use strict';
  var parser = function(expr){

    if(!expr) return function(){};

    var RESERVED_WORDS = ['abstract', 'boolean',	'break', 'byte', 'case', 'catch',	'char',	'class', 'const',	'continue',
      'default', 'delete', 'do', 'double', 'else', 'extends', 'false', 'final', 'finally', 'float', 'for', 'function', 'goto', 'if', 'implements',
      'import', 'in', 'instanceof', 'int', 'interface', 'long', 'native', 'new', 'null', 'package', 'private', 'protected', 'public', 'return', 'short',
      'static', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'true', 'try', 'typeof', 'var', 'void', 'while', 'with'
    ];

    var props = [], propsChk = {};
    var f = new Function('ctx', 'try{return ' + expr.split(/('[^']*'|"[^"]*")/).map(function(part){
      if(part.indexOf('"') === 0 || part.indexOf('\'') === 0 || part.length === 0) return part;
      return part.replace(/[\$_A-Za-z][\$_A-Za-z0-9\.\[\]]*/g, function(hit){
        if(RESERVED_WORDS.indexOf(hit) === -1){
          propsChk[hit] || props.push(hit);
          propsChk[hit] = true;
          return 'ctx.' + hit;
        }else{
          return hit;
        }
      });
    }).join('') + ';}catch(e){return;}');

    f.depends = props;

    return f;

  };

  var chached = (function () {
    var chache = {}, KEY_PREFIX = 'KEY_';
    return function(expr){
      if(!chache[KEY_PREFIX + expr]){
        chache[KEY_PREFIX + expr] = parser(expr);
      }
      return chache[KEY_PREFIX + expr];
    };

  })();

  factory({
    parse: chached
  });

})(typeof window === 'undefined' ? function(obj){
  module.exports = obj;
} : function(obj){
  window.util = obj;
});

