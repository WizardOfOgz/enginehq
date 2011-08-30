/*
(function() {   
  
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
  
  $("#avatarForm", this).each(imageUpload);
  $("form").each(function(index, form) {
    form = $(form);
    // Setup Cloneables    
    Cloneable.setup(form);
  });
}());
*/
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
  AdvisorsHQ.submitForm($(this).closest("form"), $(this));
  e.preventDefault();
  return false;
});

// Select all convenience method on licenses or contracts?
$(document).delegate(".select-all-action", "click", function selectAllCheckboxes() {
  $(this).closest(".field-group").find("input[type=checkbox]").attr("checked", true);
});

$(document).delegate(".file-input input", "click", function() {
  if (this.value) {
    var file = this.files ? this.files[0] : {};
    label.removeClass("empty").html(file.name || this.value);
    fileInput.title = file.name || this.value;
  } else {
    label.addClass("empty").html(empty);
  }
});
