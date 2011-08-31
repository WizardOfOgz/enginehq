$(document).delegate(".premium-overview .page", "click", function() {

  var premiumOverview = $(this).closest(".premium-overview")
    , channels = premiumOverview.find(".channel")
    , selected = channels.filter(".selected");

  // next
  if ($(this).hasClass("next") && !channels.last().hasClass("selected")) {
      selected.removeClass("selected").next(".channel").addClass("selected");
    
  //prev
  } else if ($(this).hasClass("previous") && !channels.first().hasClass("selected")){
    selected.removeClass("selected").prev(".channel").addClass("selected");
  }
});
