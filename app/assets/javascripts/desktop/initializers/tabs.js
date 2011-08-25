$(document).delegate("a", "click", function tab(e) { 
  if (this.hash.length < 1) {
    return;
  }
  
  var group = $(this).closest("ul")
    , selectedTab = $(this).parent().addClass("selected")
    , tabSiblings = selectedTab.siblings().removeClass("selected");
 
  tabSiblings.children("a").each(function() { $(this.hash).hide(); });
  var container = $(this.hash).show();
  
  AdvisorsHQ.setSelectedTab(group.get(0).className, this.hash);
 
  if (container.length < 1) {
    container = $("<div></div>").attr("id", this.hash.substr(1)).css({display: "block"});
    $("#contentSections").append(container);
    
    AdvisorsHQ.load(this.href);
  } 
  
  e.stopPropagation();
  e.preventDefault();
});