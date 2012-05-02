// As of 2011-11-22, GCF has an outstanding issue where tab index is not maintained properly.  This causes the tab focus
// to switch to the first possible tabbable element the first time TAB is pressed, regardless of what other element was
// previously focused.  Once the tab key is pressed the first time, tabbing occurs naturally.  This behavior resets each
// time a page is navigated to in GCF.  (If GCF registry entry "HandleTopLevelRequests" is set to "0", then the behavior
// does not reset on a simple navigation, but does reset with new windows, etc).

// This workaround adds a handler for focusout (which is triggered when the user tabs out of an element) capturing which
// element was last focused.  It then checks if the focus is traversing TO the first possible tabbale element (a div with
// ID: ChromeFrameWorkaroundDiv, which is inserted into the DOM programatically) and if so, refocuses the previously
// focused element.  It assumes any time the ChromeFrameWorkaroundDiv div is focussed, it was erroneous.  It also assumes
// the ChromeFrameWorkaroundDiv div is the first tabbable element in the DOM.

// See http://code.google.com/p/chromium/issues/detail?id=102177 for the current status of the issue as tracked at the
// Chromium project.

// This workaround uses the jQuery framework.
function addChromeFrameFocusWorkaround() {
  // Only apply workaround if we are in Google Chrome Frame (window.externalHost is the indicator)
  if (navigator.userAgent.indexOf("Chrome") != -1 && window.externalHost) {
    $(document).ready(function() {
      // Add the empty div to the DOM
      $("body").prepend("<div style='width: 0; height: 0;' tabindex='1' id='ChromeFrameWorkaroundDiv'></div>");
      // Track the element that is losing focus
      var lastFocus = null, 
          fsElem = null, 
          index = null, 
          newFocus = null,
          h4Parent = null;

      $(document).focusout(function(evt) {
        if (evt && evt.target) {
          lastFocus = $(evt.target);
          // we will get next target rather than move back to the original selection
          fsElem = lastFocus.parents('body').find('a, input, textarea, select, h4').not('[tabindex="-1"]');
          index = fsElem.index(lastFocus);
          if(lastFocus.is('h4')) {
            h4Parent = lastFocus.parents('.autocomplete-results');
            fsElem = h4Parent.find('h4');
            index = fsElem.index(lastFocus);
          }
          newFocus = fsElem.eq(index+1);
        }
      });
      // When focus is given to the ChromeFrameWorkaroundDiv, give it back to the previous element.
      $("#ChromeFrameWorkaroundDiv").focusin(function() {
        if(newFocus && index > -1) {
          newFocus.focus();
        } else {
          lastFocus.focus(); // we'll refocus the last focused item in case something goes wrong.
          // That way people won't lose their mind having to move their hand to the mouse to refocus and keep moving
        }
        if(h4Parent) setTimeout(function() { 
          h4Parent.show(); 
        }, 10); // probably could drop this, but at 10ms, it's almost unnoticable
        // basically makes it guaranteed that it'll fire after the hide event is called `ie: nextTick()`
      })
    });
  }
}
addChromeFrameFocusWorkaround();