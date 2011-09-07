var KeepAlive = (function() {
  
  var duration = 7260000 // 2hrs 1min in milliseconds
    , warningPeriod = 60000 // 5min in milliseconds
    , start
    , timeoutId
    , API = {}
    , banner = null;
  
 // duration = 65000;/* 1min timer for debuggin */
  
  /**
  * Resets the timers
  */
  function resetDates() {
    start = new Date().getTime();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(countdown, 60000); 
  }
  
  /**
  * Pings the backend to keep the session alive.
  */
  function keepAlive() {
    banner.remove();
    banner = null;
    $.get("/keep_alive");
    resetDates();
  }
  
  /**
  * Processes the countdown .
  */
  function countdown() {
    if ((new Date()).getTime() - start < (duration - warningPeriod)) { // silent countdown
      timeoutId = setTimeout(countdown, 1000);
      return;
    } 
    updateMessage();
  }
  
  /**
  * Updates the counter message.
  */
  function updateMessage() {
    
    var now = new Date().getTime();
    if (now - start > duration) {
      window.location.reload(true);
      return;
    }
     
   if (!banner) {
     banner = $("<div class=\"inactivity-timer\"><span class=\"message\"></span><a class=\"action continue-action\" href=\"#\"><span>Continue Using HQ</span></a></div>").appendTo($(".app-wrap"));
     $("a", banner).click(keepAlive);
   }
   
   $(".message", banner).html(["You will be logged off in <em>", ((duration - (now - start))/1000).toFixed(0), "</em> seconds due to inactivity"].join(""));
   timeoutId = setTimeout(updateMessage, 1000);
  }
  
  API.resetTimer = function() {
    resetDates();
  };
  
  API.updateMessage = updateMessage;

  resetDates();
  $(document).bind("xhrEnd", resetDates);
  
  return API;
}());