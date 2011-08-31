$(document).delegate(".show-notes-message", "click", function expandMessageComments() {
  $(this).next(".message-notes").addClass("expanded");
  $(this).remove();
});
  
$(document).delegate(".message-sub-forms .form-title", "click", function expandMessageSubForm() {
  var siblings = $(this).siblings();
  if (!$(this).hasClass("active")) {
    $(this).addClass("active").next().addClass("active").find("textarea").focus();
  } else {
    siblings = siblings.andSelf();
  }
  siblings.removeClass("active");
});

$(document).delegate("#messagesPagingForm input", "click", function(e) {
  var form = $(this).closest("form")
    , params = form.serializeArray().concat({name: this.name, value: this.value });
    
  HQApp.load(form.attr("action"), $.param(params), { method: form.attr("method") });
  return false;
});