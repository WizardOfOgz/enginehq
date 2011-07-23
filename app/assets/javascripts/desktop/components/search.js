/*jslint browser: true, indent: 2 */
/*global $, jQuery, window, escape,  AdvisorsHQ */

/**
* @param {Node} node The node search to turn into an autocomplete.
* @param {String} method The method to use to submit the search [get || post]
* @param {Object} options The options to set on the autocomplete.
* options.returnOnSubmit {boolean} True if the form will do a full page submit when return is pressed, false, null or undefined otherwise.
*/
(function($) {
  
  var _options;
  
  /**
  * Delegate to listen for search field events.
  */
  $.fn.search = function(selector, options) {
    _options = options
    return this.delegate(selector, {
      click : init,
      focus : init,
      keydown : init
    });
  }
  
  /**
  * Initiaizes the search component if it hasn't already been initialized.
  */
  function init(event) {
    if (!$(this).data("search.initialized")) {
      search($(this).data("search.initialized", true)); 
      $(event.target).trigger(event.type + ".search");
    }
  }
  
  function search(node) {
  
    var body = $(document.body),
        search = $("input[type=search], input[type=text]", node).attr("autocomplete", "off"), // Hack.. only HTML5 parsers honor type=search
        submit = $("input[type=submit]", node), 
        form = search.closest("form"), 
        method = form.attr("method"),
        results = $("<ul class=\"autocomplete-results\"></ul>"), 
        timer,
        ajaxRequest,
        token = search.attr("value");
  

    function select(e) {
      var action = results.children(".selected").find("a, input[type='submit']"),
          href = action.attr("href");
        
      if (action.hasClass("action")) { // Action: Open as Overlay
        Overlay.open(href, function () {
          AdvisorsHQ.load(form.attr("action"), form.serialize(), {"method" : method});
          search.attr("disabled", "disabled"); // disabled the search, as the form is reloading
        });
      } else if (href) { // Anchor: Full page reload
        window.location = href;
      } else if (action.attr("type") === "submit") { // Submit: AJAX Load it
        AdvisorsHQ.load(form.attr("action"), $.param(form.serializeArray().concat([{"name" : action.attr("name"),"value" :  action.attr("value")}])), {
          "method" : method
        }, action);
      }
        
      if (e) {
        e.preventDefault();
        e.cancelBubble = true;
      }
    }

    /**
    * Loads the returned AJAX response into the autocomplete.
    * @private
    */
    function load(html, status) {
      node.removeClass("searching");
        
      // The request was aborted
      if (status === "success" && html) {
        results.empty();
        $(html).appendTo(results)
          .first().addClass("selected")
          .find(".result-title").focus().end().end()
          .find("a, input").attr("tabIndex", -1);
      }
    }   
  
    function refresh(time) {
      results.empty().show();
      $("<li class=\"item result waiting\"><h4 class=\"result-title\">Searching, please wait&hellip;</h4></li>").appendTo(results);
      if (ajaxRequest) {
        var temp = ajaxRequest;
        ajaxRequest = null;
        temp.abort();
      }
        
      timer = setTimeout(function() {
        ajaxRequest = $.ajax({
          url: form.attr("action"),
          data: $.param(form.serializeArray().concat([{"name" : submit.attr("name"), "value" : submit.val()}])),
          success: load,
          type: method,
          cache: false,
          dataType: "html"});
      }, time);
    }

    function resetToken() {
      token = null;
      results.empty().hide();
      if (ajaxRequest) {
        var temp = ajaxRequest;
        ajaxRequest = null;
        temp.abort();
      }
    }

    node = $(node);
    
    // Set Default Values
    options = _options || {};
  
    // Bind key events and click to the search input
    search.bind({
      "keyup.search" : function() {
        var value = search.val();
        if (value && token !== value) {
          if (timer) {
            clearTimeout(timer);
            timer = null;
          }
          
          token = value;
          refresh(250);
        } else if (!value) {
          resetToken();
        }
      },
      "click.search" : function() {
        if (!search.val()) {
          resetToken();
        } else {
          results.show();
          node.addClass("focus");
          if (results.children().length === 0) {
            refresh(1);
          }
        }
      }
    });
    
    
    search.add(submit).add(results).bind({"keydown.search" : function(e) {      
        var active = results.children(".selected"),
            newActive = null,
            key = e.which;
          
        if (key === 13) {
          if (active.length < 1 && options["returnOnSubmit"]) {
            results.hide();
            node.removeClass("focus");
            return;
          } 
          select();
        } else if (key === 40) {
          newActive = active.next();
        } else if (key === 38) {
          newActive = active.prev();
        } else if (key === 9) {
          return; // let the tab operate as normal
        } else { 
          if ($.inArray(key, [9,13,16,17,18,38,40,91,92]) < 0) {
            search.focus();
          }
          return;
        }

        if (newActive && newActive.length > 0) {
          newActive.addClass("selected").find(".result-title").focus();
          active.removeClass("selected");
        }

        e.preventDefault();
        e.cancelBubble = true;  
      }
    }); 
    
    node.find(".tokens").bind("click.search", function(e) {
      search.focus();
    });
    
    node.find(".screens").change("change.search", function(e) {
      search.focus();
      if (token && token.length > 0) {
        refresh(0);
      }
    });
    
    node.delegate(".token input[type=checkbox]", "click.search", function(e) {
      $(this).closest(".token").fadeOut(100, function() {
        $(this).remove();
        node.find(".query").appendTo(node.find(".tokens"));
        search.focus();
      });
    });
    
    node.delegate(".autocomplete-results > li", {
      "click.search" : select,
      "focusin.search" : function() {
        results.children().removeClass("selected");
        $(this).addClass("selected");
      },
      "mouseover.search" : function() {
        results.children().removeClass("selected").filter(this).addClass("selected").find(".result-title").focus();
      }
    });
    
    form.bind("submit", function() {
      resetToken(); // reset the token if the form submits so an AJAX error doesn't appear
    });
          
    results
      .hide()
      .appendTo(node.find(".query"))
      .addClass(node.offset().left - $(body).offset().left > 300 ? "left-align" : "right-align")
      .ajaxError(function(e, xhr) {
        if (ajaxRequest === xhr) {
          $(this).empty().append("<li class=\"item result error\"><h4 class=\"result-title\">An error occurred while searching.</h4></li>");
        }
      });
    
    $(document.body).bind("focusin.search", function(e) {
      if (node.get(0) !== e.target && !$.contains(node.get(0), e.target)) {
        results.hide();
      }
    });

    $(document.body).bind("click.search", function(e) {
      if (!$.contains(node.get(0), e.target)) {
        results.hide();
        node.removeClass("focus");
      }
    });
  }
})(jQuery);