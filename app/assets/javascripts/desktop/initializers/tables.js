// Row Highlighting
$(document).delegate(".records tr", "click", function() {
  $(this).toggleClass("highlight").siblings().removeClass("highlight");
});
  
// Filters
$(document).delegate(".screen-records-field select", "change", function() {
  var submit = $(this).closest(".screen-records-field").find("input[type=submit]"),
      form = $(this).closest("form");
    
  AdvisorsHQ.load(form.attr("action"), $.param(form.serializeArray().concat([{name : submit.attr("name"), value : submit.val()}])), {"method" : "get"});
});
  
// Ajax
$(document).delegate(".records input[type=submit], .records-form input[type=submit]", "click", function(e) {
  // Let download (csv, pdf) resume as normal
  if ($(this).closest(".action-group").length > 0) {
    return;
  } 
  
  AdvisorsHQ.submitForm($(this).closest("form"), $(this));
  e.preventDefault();
  return false;
});
