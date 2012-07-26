$(document).ready(function($) {
	
	$(".form select#field_style").live("change", function(){
		$(this).closest("form.form").submit();
	});
	
});