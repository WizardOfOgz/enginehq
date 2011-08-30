(function() { 
  function setupHTMLInputs(i, textarea) {
    var id = textarea.id
      , $textarea = $(textarea).attr("id", textarea.id ? id : "tinyMCETextarea" + i);
      
    $("<span class='toggle-editor'>Toggle Editor</span>").appendTo($(this).parent()).click(function() {
      tinyMCE.execCommand('mceToggleEditor', true, $textarea.attr("id"));
		});
		setupTinyMCE($textarea);
  }
  
  function setupTinyMCE($textarea) {
		$textarea.tinymce({
	  	script_url : '/js/desktop/lib/tiny_mce/tiny_mce.js',
	    mode : "textareas",
	    theme : "advanced",
			skin : "agencieshq",
	    theme_advanced_buttons1 : "bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,formatselect,fontselect,fontsizeselect,|,bullist,numlist,|,forecolor,|,undo,redo,|,agencieshqimage",
			theme_advanced_buttons2 : "",
	    theme_advanced_buttons3 : "",
	    inlinepopups_skin : "agencieshq",
      plugins : "autolink,style,agencieshq,inlinepopups",
	    theme_advanced_toolbar_location : "top",
      theme_advanced_toolbar_align : "left",
			theme_advanced_source_editor_height : 1,
			theme_advanced_resizing_min_height : 1,
			setup : function(ed) {
        ed.onInit.add(function(ed, e) {
  				// Update the form when save is pressed
  				$textarea.closest("form").bind({
  			    submit : function() {
  			      ed.save();
  			    }
  			  });
        });
      }
		});
	}
  
  function imageUpload() {
    
    var imagePreview = $("<span><canvas /></span>").addClass("preview").appendTo($(".avatar", this))
      , fileInput = $("input[type='file']", this)
	    , imageEditor
	    , imageDataInput;
	  
	  imagePreview.bind("preview", function(e, pngData) {
	    $(".avatar-current img").attr("src", pngData);
	    
	    if (!imageDataInput) {
	      imageDataInput = $("<input type=\"hidden\" name=\"avatar_uri\" />").insertAfter(fileInput);
	    }
	    imageDataInput.val(pngData);
	    $(fileInput).closest("form").get(0).reset();
	  });
	  
    fileInput.change(function() {
      
      if (!imageEditor) {
         imageEditor = new ImageEditor(imagePreview.find("canvas").get(0), {
           width : imagePreview.width(),
           crop_width : $(".avatar-current").width() - 20
        }); 
      }
      
      if (this.files && this.files.length > 0) {
        imageEditor.setImageFile(this.files[0]);
      }
	  });
  }
  
  $("form").each(function(index, form) {
    $(form).find("p.color-field, td.color-field").colorInput().end()
      .find("div.html-field textarea").each(setupHTMLInputs);
  });
}());


$(document).delegate(".open-color-picker", "click", function openColorPicker(e) {
  $(this).trigger("colorpicker", [$(this).closest(".color-field").find("input")]);
  return false;
});