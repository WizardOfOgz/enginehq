$(document).delegate(".field-group-head input[name='add'], input[name$='[remove]']", "click", function addSubFormItem(e) {
  var form = $(this).closest("form"),
      submit = $(this);
  
  AdvisorsHQ.load(form.attr("action"), $.param(form.serializeArray().concat([{"name": submit.attr("name"), "value":submit.val()}])), {method:"post"}, submit);
  return false;
});