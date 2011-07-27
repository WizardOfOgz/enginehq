(function() {
  $(document).delegate(".content-links a", "click", tab);
  $(document).delegate(".field-group-index a", "click", tab);
  $(document).delegate(".field-group-navigation a", "click", tab);
  
  
  function tab(e) { 
    var group = $(this).closest("ul"),
        selectedTab = $(this).parent().addClass("selected"),
        tabSiblings = selectedTab.siblings().removeClass("selected");

  	tabSiblings.children("a").each(function() { $(this.hash).hide(); });
  	$(this.hash).show();
  	
  	AdvisorsHQ.setSelectedTab(group.get(0).className, this.hash);

  	e.stopPropagation();
  	e.preventDefault();
  }
}());