(function() {
  
  var xhrs = [],
      historyStates = 1,
      downloads = 0,
      tabs = {};
  
  
  function process(html) {
    html = $(html);
     
    var winY = $(window).scrollTop()
      , container =  $("#" + html.attr("id"))
      , tabs = AdvisorsHQ.getSelectedTabs();
    
    html.attr("style", container.attr("style"));
    container.replaceWith(html);
    
    for (group in tabs) {  
      var className = "." + group.replace(/\s/, ".");
       var tab = $(className).find("a[href='" + tabs[group] + "']");
       if (tab.length > 0) {
         tab.trigger("click");
       } else {
         delete tabs[group];
       }
    }
    
    $(window).scrollTop(winY);
  }
  
  
  
  /**
  * Proceses the given HTML fragment.
  
  function process(html) {
    var insertionObject = jQuery.parseJSON($(html).filter("script").html())[0],
        selector = insertionObject.selector,
        insertion = insertionObject.insertion,
        box = $("<div style=\"display:none;\"></div>").appendTo(document.body),
        winY = $(window).scrollTop();
        
    // Create a loading container to filter the markup to be appended
    $(html).appendTo(box);
    $("script", box).remove();
    html = box.children();
    box.remove();
    
    $(selector)[insertion](html);

    var tabs = AdvisorsHQ.getSelectedTabs();
    for (group in tabs) {
      
      var className = "." + group.replace(/\s/, ".");
       var tab = $(className).find("a[href='" + tabs[group] + "']");
       if (tab.length > 0) {
         tab.trigger("click");
       } else {
         delete tabs[group];
       }
    }

    // return window to original y position during AJAX swap
    $(window).scrollTop(winY);
    
    init(html);
  }*/
  
  /**
  * Applies all attached initializers using the given context.
  * @param {Node} context The context to use for the initializers.
  */
  function init(context) {
    context = $(context);
    for (var method in AdvisorsHQ.fn) {
      var error = null;
      try {
        AdvisorsHQ.fn[method].apply(context);
      } catch(e) { 
        error = e;
      }
      
      if (error !== null) {
        logError({
          "initializer" : method,
          "exception" : error.toString(),
          "trace" : printStackTrace({e : error})//.join('\n\n')
        });
      }
      
    }
  }
  
  function popXHR(xhr) {
    for (var i=0; i<xhrs.length; i++) {
      if (xhrs[i] === xhr) {
        xhrs.remove(i, i);
        break;
      }
    }
    
    if (xhrs.length < 1) {
      $(document.body).trigger("xhrEnd");
    }
  }
  
    function logError(data, callback) {
      console.group("An error has occurred");
      
      data.vendor = navigator.vendor;
      data.userAgent = navigator.userAgent;
      data.platform = navigator.platform;
      data.location = document.location.href;
      data.authenticity_token = $("body").data("auth-token");
      
      console.error(data);
     $.ajax({
        "url" : "/js_exception_notifier",
        "type" : "post",
        "data" : data,
        "complete" : callback || function() {}
      });
      console.groupEnd();
  }
  

  var AdvisorsHQ = {
    
    fn : {},

		Templates : {},
    
    initialize : init,
    
    setSelectedTab: function(groupClassName, hash) {
      tabs[groupClassName] = hash;
    },
    
    getSelectedTabs: function(groupClassName, hash) {
      return tabs;
    },
    
    /**
    * Makes an AJAX request and processes the resulting HTML.
    * @param {String} action The action the AJAX will hit.
    * @param {Object} data The data parameters to send with the XHR.
    * @param {String} options.method The method used to make the request (defaults to get).
    * @param {Function} options.preInsert(html, selector, insertion) The function to call before the returned HTML is inserted onto the DOM (optional).
    * @param {Function} options.postInsert(html, selector, insertion) The function to call after the returned HTML is inserted onto the DOM (optional).
    * @param {Object} options.scope The object to scope the insertion to (optional).
    * @param {String} options.message The status message to display while the request is processign. (defaults to loading...).
    * @param {boolean} options.saveHistory True if the url should be saved in the history, false otherwise. (defaults to true, only applies to get request)
    * @param {Node} submit The submit input to activate if an error occurs to fall back onto full page laoding. (Get resuests are handled automatically).
    */
    load : function(action, data, options, submit) {
      
      function reload() {
        if (submit && options.method === "post" || options.method === "POST") {
          submit = $(submit);
          submit.parents("form").unbind();
          $(["<input type=\"hidden\" name=\"", submit.attr("name"), "\" value=\"", submit.attr("value"), "\" />"].join("")).appendTo(submit.parent());
          submit.submit();
        } else {
          window.location = [action, "?", data].join("");
        }
      }
      
      options = options || {};
      options.method = options.method || "get";
      data = data || "";
      
      $.ajax({
        "url" : action,
        "type" : options.method,
        "dataType" : "html",
        "cache" : false,
        "data" : data,
        
        success : function(html, textStatus, xhr) {
          try {
            process(html);
          } catch (e) {
            logError({"exception" : e.toString(), "action" : [action, "?", data].join(""), "html" : html }, reload);
          }
        },
        
        error : function(xhr, textStatus, errorThrown) {
          popXHR(xhr);
          logError({"error" : (errorThrown || "An error occurred with the AJAX request").toString(), "status" : textStatus, "action" : [action, "?", data].join("")}, reload);
        },
      
        beforeSend : function(xhr) {
          $(document.body).trigger("xhrStart", [options.message || "Loading, Please Wait"]);
          xhrs.push(xhr);
        },
        
        complete : function(xhr, textStatus) {
          popXHR(xhr);
        }
      });
      
                // Only browsers that support push state can save the AJAX request in history
          if (options.saveHistory !== false && window.history.pushState && options.method === "get") {
            window.history.pushState({ page : historyStates }, document.title, [action, data.length > 0 ? "?" : "", data].join(""));
            historyStates++;
          }
      
    },
    
    /**
    * Binds events to the given forms to submit their contents using XHR.
    * @param {Object} forms The form(s) to submit with XHR
    * @param {String} the selector of inputs to exclude from the event binding.
    */
    ajaxForm : function(forms) {
              
      forms = $(forms);

      // Catch individual input submissions
      $("input[type=submit]", forms).bind("click.ajaxform", function(e) {
        if ($(this).hasClass("csv-action")) {
          return;
        }
        
        AdvisorsHQ.submitForm($(this).parents("form"), this);
        e.preventDefault();
        return false;
      });
    },
    
    submitForm : function(form, submit) {
      form = $(form);
      submit = submit || $("input[type=submit]", form).last(); // if no submit was clicked.. get the 1st in the for
      var params = form.serializeArray().concat([{"name" : $(submit).attr("name"), "value" : $(submit).attr("value")}]);
      AdvisorsHQ.load(form.attr("action"), $.param(params), {"method" : form.attr("method")}, $(this));
    }
    
  };
  
  // Make the AdvisorsHQ object globally available
  window.AdvisorsHQ = AdvisorsHQ;
  
  // Initialize the application
  $(function() {
    $.ajaxSettings.accepts.html = $.ajaxSettings.accepts.script;
    if (window.history && window.history.pushState) {
      window.history.pushState({ page : historyStates }, document.title, window.location);
      historyStates++;
    }
    
    init(document.body);
  });
  
  // Bind Popstate to Control History
  $(window).bind("popstate", function(e) {
    if (!e.originalEvent.state || !e.originalEvent.state.page) {
      return false;
    }
    window.location = document.location;
    return false;
  });

})();

/* Give all arrays a remove method */
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};