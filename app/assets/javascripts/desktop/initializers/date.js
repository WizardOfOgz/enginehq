$(document).delegate(".date-field input", "keydown", function onFocusDateInput(e) {
  $(this).removeAttr("newFocus");
});
  
$(document).delegate(".date-field input", "keyup", function autoFocusDateInput(e) {
  var key = e.which;
  var inputs = $(this).closest(".date-field").find("input");
  var index = inputs.index($(this));

  if ((key >= 96 && key <= 105) || (key >= 48 && key <= 57)) {
    var maxlength = $(this).attr("maxlength");
    var value = $(this).val();
    if (value.length >= maxlength && !$(this).attr("newFocus") && !isNaN(parseInt(value, 10))) { // If the input retrieves a keyup and never had a keydown.. don't tab
      nextInput = $(inputs.get(index + 1)).focus().select().attr("newFocus", true);
    }
  }
});
  
$(document.body).delegate(".date-field span.open-calendar", "click", function openCalendar(e) {
  var dateField = $(this).closest(".date-field");
  var inputs = dateField.find("input");
  $(this).trigger("openCalendar", [dateField, {
    "month" : inputs.get(0),
    "day" : inputs.get(1),
    "year" : inputs.get(2)
  }]);
});
