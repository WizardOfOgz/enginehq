$(document).delegate(".date-field input", "keydown", function onFocusDateInput(e) {
  $(this).removeAttr("newFocus");
});
  
$(document).delegate(".date-field input", "keyup", function autoFocusDateInput(e) {
  var key = e.which
    , inputs = $(this).closest(".date-field").find("input")
    , index = inputs.index($(this));

  if ((key >= 96 && key <= 105) || (key >= 48 && key <= 57)) {
    var maxlength = $(this).attr("maxlength")
      , value = $(this).val();
      
    if (value.length >= maxlength && !$(this).attr("newFocus") && !isNaN(parseInt(value, 10))) { // If the input retrieves a keyup and never had a keydown.. don't tab
      nextInput = $(inputs.get(index + 1)).focus().select().attr("newFocus", true);
    }
  }
});
  
$(document.body).delegate(".date-field span.calendar-action", "click", function openCalendar(e) {
  var dateField = $(this).closest(".date-field")
    , inputs = dateField.find("input");
    
  $(this).trigger("openCalendar", [dateField, {
    "month" : inputs.get(0),
    "day" : inputs.get(1),
    "year" : inputs.get(2)
  }]);
});

$(document).on('keypress', '.date-field .control > label > input', function(e) {
  if(e.which === 32) { // space key

    // date values
    var today = new Date();
    var month = today.getMonth()+1;
    var day = today.getDate();
    var year = today.getFullYear();

    var parent = $(this).parents('.date-field');
    var $month = parent.find('.month input');
    var $day = parent.find('.day input');
    var $year = parent.find('.year input');

    $month.val(month);
    $day.val(day);
    $year.val(year);
    $year.focus();

    // var nextField = parent.next().find('input, select, textarea').eq(0);
    // while(nextField.length === 0) {
    //   // we'll traverse the dom tree until we come to the next focusable input
    //   parent = parent.parent();
    //   nextField = parent.next().find('input, select, textarea').eq(0);
    // }
    // nextField.focus();
  }
});