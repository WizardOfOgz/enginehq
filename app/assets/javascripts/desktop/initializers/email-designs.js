(function() {
    
  var styleTabs = null,
      htmlEditor,
			pageBackground="#FFFFFF",
			docTemplate = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:og="http://opengraphprotocol.org/schema/" xml:lang="en" lang="en"><head></head><body style="background-color:{{background_color}};">{{yield}}</body></html>'
    
  function setupTemplateForm(i, context) {
    loadEditor();

    var form = $(context).find(".email-design-form");
		styleTabs = new Tabbable(form.find(".field-group-navigation"), form.find(".field-group"), 0);
				
  }
  
  function loadEditor() {
    var form = $(".email-design-form");
    styleTabs = new Tabbable(form.children(".email-design-styles").children(".email-design-sections"), form.children(".email-design-styles").children(".style-group"),  (styleTabs && styleTabs.getActiveIndex() || null));
    var toolbarWrap = $("<div class=\"toolbar-wrap\"></div>").prependTo("#emailDesignPreview");
     
    htmlEditor = $("textarea").tinymce({
      script_url : '/js/desktop/lib/tiny_mce/tiny_mce.js',
      mode : "textareas",
      theme : "advanced",
			skin : "agencieshq",
      theme_advanced_buttons1 : "bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,formatselect,fontselect,fontsizeselect,|,bullist,numlist,|,forecolor,|,undo,redo,|,agencieshqimage",
      theme_advanced_buttons2 : "",
      theme_advanced_buttons3 : "",
      theme_advanced_toolbar_location : "top",
			preformatted : true,
			dialog_type : "inline",
			inlinepopups_skin : "agencieshq",
      plugins : "autolink,style,agencieshq,inlinepopups",
			height : "550px",
			width : "100%",
      setup : function(ed) {
        ed.onInit.add(function(ed, e) {
	
					$(".email-section-fields").each(function(index, section) {
						var id = $("input[name$='[id]']", section).val();
						tinymce.activeEditor.$("#emailSection" + id).bind("click", openTab(index));
					});
					tinymce.activeEditor.$("body").bind("click", openTab(0));
	
					// Update the form when save is pressed
					form.bind({
			      keyup : updateStyle,
			      change : updateStyle,
			      submit : function() {
			      	htmlEditor.tinymce().save();
							html = docTemplate.replace("{{background_color}}", pageBackground).replace("{{yield}}", htmlEditor.val())
							htmlEditor.get(0).value = html;
			      }
			    });
        });
      }
    });
  }

	function openTab(index) {
		return function(e) {
			styleTabs.selectIndex(index);
			return false;
		}
	}
  
  function updateStyle() {
		if (!(htmlEditor && htmlEditor.tinymce)) {
			return;
		}
		
		$(".email-section-fields").each(function(index, section) {
			var id = $("input[name$='[id]']", section).val();
			var props = {
				'background-color': $("input[name$='[background_color]']", section).val(),
				'padding': $("input[name$='[padding]']", section).val() + "px",
				'border-color': $("input[name$='[border_color]']", section).val(),
				'border-width' : getBorderWidth($("select[name$='[border_position]']", section).val(), $("input[name$='[border_width]']", section).val()),
				'border-style': $("select[name$='[border_style]']", section).val(),
				'width': $("input[name$='[width]']", section).val() + "px"
			};	

			for (var name in props) {
				if (index == 0 && name == "background-color") {
					pageBackground = props[name]
					htmlEditor.tinymce().dom.getRoot().style.backgroundColor = pageBackground;
				} else {
					htmlEditor.tinymce().dom.setStyle("emailSection" + id, name, props[name]);
				}
			}			
		});
  }

	function getBorderWidth(position, width) {
		return position.replace(/\{\{width\}\}/g, width + "px")
	}

  AdvisorsHQ.fn.emailDesigns = function() {
    $("#emailDesignForm", this).each(setupTemplateForm);
  };
})();