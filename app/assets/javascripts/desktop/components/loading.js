/**************************************************************
* Displays a loading indicator when AJAX requests fire off.
***************************************************************/
$(function() {
  var indicator;
  $(document).bind("xhrStart", function(e, message) {
    
    if (indicator) {
      clear();
    }
    
    indicator = $("<p class=\"loading-indicator\"><span>" + message + "</span></p>");
    indicator.appendTo(document.body);
  });
  
  $(document).bind("xhrEnd", clear);

  function clear(e) {
    if (indicator) {
      indicator.remove();
      indicator = null;
    }
  }
});