/**
* Defaults the global console object to an empty object if it doesn't exist. This enables log statements to be included passively in IE7 & IE8.
**/
(function(window) {
  if (!window.console) {
    window.console = {
      log : function() { }, 
      warn : function() { },
      error : function() { },
      trace : function() { return "No trace available."; },
      group : function() { },
      groupEnd : function() { }
    };
  }
})(window);