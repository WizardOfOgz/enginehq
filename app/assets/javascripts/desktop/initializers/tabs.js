$(document).delegate("a", "click", function tab(e) { 
  if (this.hash.length < 1) {
    return;
  }
  
  var group = $(this).closest("ul")
    , container = $(this.hash);
  
  // if the container doesn't exist or its a content section, set main tabs
  if (container.length < 1 || container.hasClass("content-section")) {
    group = $("#contentLinks");
    group.children().removeClass("selected").children("a[href$=" + this.hash + "]").parent().addClass("selected");
    
    // Links that are not in the tab menu ALWAYS trigger AJAX calls
    if (!jQuery.contains(group.get(0), this)) {
      container.remove();
      container = null;
    }
  } else {
    $(this).parent().addClass("selected").siblings().removeClass("selected")
  }

  if (!container || container.length < 1) {
    container = $("<div></div>").attr("id", this.hash.substr(1)).css({display: "block"});
    $("#contentSections").append(container);
    AdvisorsHQ.load(this.href);
  } 
  
  group.find("a").each(function() { 
    $(this.hash).hide(); 
  });
  
  container.show();
  
  // save tab selection
  AdvisorsHQ.setSelectedTab(group.get(0).className, this.hash);
  
  
  e.stopPropagation();
  e.preventDefault();
});