$(document).ready(function($) {
  $("#role_and_permissions input[type=checkbox].select_all").click(function(){
    if($(this).attr('checked')==true){
      $(this).closest("tr").find("input.role_checkbox").prop("checked",false);
    }else{
      $(this).closest("tr").find("input.role_checkbox").prop("checked",true);
    }
  });
});