$(document).delegate("#paidPremiumForm .sum-action", "click", function calculateOverride() {
  var row = $(this).closest("tr")
    , totalPremium = $(".paid-premium .input", row).spreadsheet("parseNumber", true);

  // update override
  totalOverride =  Math.round(totalPremium * $(".override-percent .input", row).spreadsheet("parseNumber"))/100;    
  $("td.override .input", row).val(isNaN(totalOverride) ? 0 : totalOverride.toFixed(2));

  return false;
});
  
$(document).delegate("#paidPremiumForm", "keyup change", function updatePaidPremiumTotals(e) {
    // premium total
  var total = $(".paid-premium .input", this).spreadsheet("sum", true);
  $(".total-paid-premium .value", this).html(total).spreadsheet("insertCommas").spreadsheet("insertDollar");
    
  // override total
  var override = $(".override .input", this).spreadsheet("sum", true);
  $(".total-override .value", this).html(override).spreadsheet("insertCommas").spreadsheet("insertDollar");
});
  
$(document).delegate("#submittedPremiumsFieldsGroup", "keyup", function sumSubmittedPremiums() {
  var amounts = $("td.premium-amount", this)
    , total = $(".totals .total-submitted-premium", this);

  total.html($(".input", amounts).spreadsheet("sum", true)).spreadsheet("insertCommas").spreadsheet("insertDollar");
});
  
$(document).delegate("#fundingFieldsGroup", "keyup", function setupFundingTable() {
  var amounts = $("td.amount", $(this).parent())
    , total = $(".input", amounts).spreadsheet("sum");
  $("td.total-funding", $(this).closest("fieldset")).html(total).spreadsheet("insertCommas").spreadsheet("insertDollar");
});

$(document).delegate("td.error", "keydown", function removeFieldError() {
  $(this).removeClass("error");
});

$(document).delegate("td", "validationError", function addFieldError() {
  $(this).addClass("error");
});
