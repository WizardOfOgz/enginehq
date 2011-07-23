(function() {
	var editor = tinyMCEPopup.editor;
	
	var form = document.forms[0];
	var srcInput = form.elements["source"];
	var urlInput = form.elements["url"];
	var heightInput = form.elements["height"];
	var widthInput = form.elements["width"];
	var alignInput = form.elements["align"];
	var altInput = form.elements["alternate_text"];
	
	var el = editor.selection.getNode();
	if (el && el.nodeName == 'IMG') {
		srcInput.value = el.src;
		heightInput.value = el.height;
		widthInput.value = el.width;
		altInput.value = el.alt;
		for (var i=0; i<alignInput.options; i++) {
			if (alignInput.options[i].value == el.align) {
				alignInput.selectedIndex = i;
			}
		}
	}
	
	urlInput.onchange = function() { 
		var img = new Image();
		img.src = this.value;
		img.onload = function() {
			heightInput.value = img.height;
			widthInput.value = img.width;
			delete img;
		};
	};
	
	form.onchange = updateImage;
	
	function updateImage() {
		var attrs = {
			src: urlInput.value,
			height : heightInput.value + "px",
			width : widthInput.value +"px",
			align : alignInput.options[alignInput.selectedIndex].value,
			alt: altInput.value,
		};
		
		if (!attrs.src) {
			return;
		}
	
		var el = editor.selection.getNode();
		if (el && el.nodeName == 'IMG') {
			editor.dom.setAttribs(el, attrs);
		} else {
			editor.execCommand('mceInsertContent', false, '<img id="__mce_tmp" />', {skip_undo : 1});
			editor.dom.setAttribs('__mce_tmp', attrs);
			editor.selection.select(editor.dom.get("__mce_tmp"));
			editor.dom.setAttrib('__mce_tmp', 'id', '');
			editor.undoManager.add();
		}
	}
}());