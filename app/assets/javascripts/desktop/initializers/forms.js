$(document).delegate(".field-group-head input[name='add'][type='submit'], input[name$='[remove]'][type='submit']", "click", function addSubFormItem(e) {
  var form = $(this).closest("form")
    , submit = $(this);

  HQApp.load(form.attr("action"), $.param(form.serializeArray().concat([{"name": submit.attr("name"), "value":submit.val()}])), {method:"post"}, submit);
  return false;
});
