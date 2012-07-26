$(document).ready(function($) {
	
	$(".form select#field_style").live("change", function(){
	  if($(this).val()=="select"){
		  $(this).closest("form.form").submit();
	  }
	});
	
});