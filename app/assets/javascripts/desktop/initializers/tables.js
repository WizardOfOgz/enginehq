// Row Highlighting
$(document).delegate(".records tr", "click", function() {
  $(this).toggleClass("highlight").siblings().removeClass("highlight");
});
  
// Filters
$(document).delegate(".screen-records-field select", "change", function() {
  var submit = $(this).closest(".screen-records-field").find("input[type=submit]")
    , form = $(this).closest("form");
    
  HQApp.load(form.attr("action"), $.param(form.serializeArray().concat([{name : submit.attr("name"), value : submit.val()}])), {"method" : "get"});
});

// Ajax
$(document).delegate(".records input[type=submit], .records-form input[type=submit], .page-control input", "click", function(e) {
  // Let download (csv, pdf) resume as normal
  if ($(this).closest(".action-group").length > 0) {
    return;
  }

  HQApp.submitForm($(this).closest("form"), $(this));
  e.preventDefault();
  return false;
});

// Edit Popout
(function($) {
  
  // settings
  var hideDelay = 500; // in milliseconds
  var opacityFadeDelay = 250; // in milliseconds
  var linkClass = 'edit-record'; // class="edit-record"
  var popoutClass = linkClass+'-popout'; // class="edit-record-popout"
  var hideCSSClass = 'edit-record-hide'; // class to hide edit link

  var hideCSS = { // css to hide element
    left: '-9999px'
  }

  var hideDelayTimer = null;
  var loadEdit = function(event) {
    var t = $('.'+linkClass);
    $('.'+popoutClass).remove(); // remove any elements made last iteration
    if(t.length > 0) {
      // grab first element
      var $el = $(t[0]).clone();

      // change classes
      $el.removeClass(linkClass);
      $el.addClass(popoutClass);

      // attach to DOM
      $('body').append($el);
      
      return t.each(function(i, el) {
        $(el).addClass(hideCSSClass);
        hideDelayTimer = null;
      });
    } else {
      // keeps jQuery chaining alive
      return t; // return empty array for no .records table
    }
  }

  // bind event handler
  // move to .on() for jquery 1.7.x
  // $('.records tbody tr, .'+popoutClass).on('mouseover mouseout', function(e) {
  $('body').delegate('.records tbody tr, .'+popoutClass, 'mouseover mouseout', function(e) {
    var $this = $(this);
    var handleTimer = function($el, e, delayTimer) {
      // remove timer if set
      if(e.type == 'mouseover') 
        if(delayTimer) 
          return clearTimeout(delayTimer);
      if(e.type == 'mouseout') {
        // reset timer if set
        if(delayTimer) clearTimeout(delayTimer);
        return setTimeout(function() {
          hideDelayTimer = null;
          $el.animate({
            opacity: 0
          }, opacityFadeDelay, function() {
            $el.css(hideCSS);
            $el.addClass(hideCSSClass);
          })
        }, hideDelay);
      }
    }

    if($this.is('tr')) { // we're hovering over a table row
      var row = this.sectionRowIndex; // get index of row
      var $ed = $('body').find('.'+popoutClass); // find popout link
      var $hed = $this.find('.'+linkClass+' a'); // find hidden link in tr
      var position = $this.offset(); // get position on page
      var edheight = $ed.outerHeight(); // get height of popout link
      var edwidth = $ed.outerWidth(); // get width of popout link
      var trheight = $this.height(); // get height of tr
      var top = position.top + (trheight/2) - (edheight/2) + 1;
      var left = position.left - edwidth + 1; // +1 to cover table border
      $ed.find('a').attr('href', $hed.attr('href')); // set href to link in table
      $ed.find('a').attr('data-row', row); // make it so I can tell which row edit link is from

      $ed.removeClass(hideCSSClass);
      $ed.css({ // set dynamic css for element
        position: 'absolute',
        top: top,
        left: left,
        opacity: 1
      });

      hideDelayTimer = handleTimer($ed, e, hideDelayTimer);
    } else { // hovering over actual edit link
      hideDelayTimer = handleTimer($this, e, hideDelayTimer);
    }
  });
  $(function() { loadEdit(); }); // runs the code on page load
  $('body').bind('ajaxComplete', function() { loadEdit(); }); // run on ajax completion
})(jQuery);