/**************************************************************
* Displays a loading indicator when AJAX requests fire off.
***************************************************************/
$(function() {
  var indicator;
  $(document).bind("xhrStart", function(e, message) {
    
    if (indicator) {
      clear();
    }
    
    indicator = $("<div class=\"loading-indicator\"><div>" + message + "</div></div>");
    indicator.appendTo(document.body);
    var spinner = new Spinner({
      lines: 10, // The number of lines to draw
      length: 3, // The length of each line
      width: 2, // The line thickness
      radius: 3, // The radius of the inner circle
      color: '#16355B', // #rbg or #rrggbb
      speed: 2, // Rounds per second
      trail: 100, // Afterglow percentage
      shadow: false // Whether to render a shadow
    }).spin();
    
    $(spinner.el).css({ position: "absolute", left: "12px", top: "50%" })
    indicator.children().append(spinner.el);
    
  });
  
  $(document).bind("xhrEnd", clear);

  function clear(e) {
    if (indicator) {
      indicator.remove();
      indicator = null;
    }
  }
});