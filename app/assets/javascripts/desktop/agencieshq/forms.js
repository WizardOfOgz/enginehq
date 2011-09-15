(function() {
  
  var imagePreview
    , fileInput
    , imageEditor
    , imageDataInput;
  
  $(document).delegate("#avatarForm input[type=file]", "change", function() {
    fileInput = $("input[type='file']", this);
    
    if (!imagePreview) {
      imagePreview =  $(this).closest(".avatar").find(".preview");
      imagePreview.bind("preview", function(e, pngData) {
  	    $(".avatar-current img").attr("src", pngData);

  	    if (!imageDataInput) {
  	      imageDataInput = $("<input type=\"hidden\" name=\"avatar_uri\" />").insertAfter(fileInput);
  	    }
  	    imageDataInput.val(pngData);
  	    fileInput.closest("form").get(0).reset();
  	  });
    }
    
    if (!imageEditor) {
       imageEditor = new ImageEditor(imagePreview.find("canvas").get(0), {
         width : imagePreview.width(),
         crop_width : $(".avatar-current").width() - 20
      });
      
      if (this.files && this.files.length > 0) {
        imageEditor.setImageFile(this.files[0]);
      }
    }
  });
}());

// When messages on the overview are saved, send the submission with AJAX
$(document).delegate("form.message-form input[type=submit]", "click", function submitMessageForm(e) {
  HQApp.submitForm($(this).closest("form"), $(this));
  e.preventDefault();
  return false;
});

// Select all convenience method on licenses or contracts?
$(document).delegate(".select-all-action", "click", function selectAllCheckboxes() {
  $(this).closest(".field-group").find("input[type=checkbox]").attr("checked", true);
});

$(document).delegate(".file-field input", "change", function() {
  var label = $('.file-field .file-label');
  if (this.value) {
    var file = this.files ? this.files[0] : {};
    label.removeClass("empty").html(file.name || this.value);
  } else {
    label.addClass("empty").html(empty);
  }
});
