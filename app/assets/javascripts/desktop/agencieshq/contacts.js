$(document).delegate(".favorite-field", "click", function checkFavorite(e) {
  var field = $(this).closest(".field-group")
    , input = $("input", this);
  
  if (input.length > 0) {
    $(".favorite-field", field).removeClass("checked");
    if (input.attr("checked")) {
      input.attr("checked", false);
    } else {
      $(this).addClass("checked");
      input.attr("checked", true);
    }
  }
  e.preventDefault();
});
  
$(document).delegate(".entity-emails .contact-field", "click", function checkPrimaryContact(e) {
  var input = $("input[type='checkbox']", this);
  if (input.length > 0) {
    input.attr("checked", !input.attr("checked"));
    $(this).toggleClass("checked");
  }
  e.stopPropagation();
  e.preventDefault();
});
