/**
 * editor_plugin_src.js
 */

(function() {
	var DOM = tinymce.DOM,
			Element = tinymce.dom.Element,
			Event = tinymce.dom.Event,
			each = tinymce.each,
			is = tinymce.is,
			focusedButton,
			pluginURL,
			defaultWindowManager;
			
	// Create the editor plugin
	tinymce.create('tinymce.plugins.DropdownInlinePopups', {
		init : function(ed, url) {
			// Replace window manager
			pluginURL = url;
			ed.onBeforeRenderUI.add(function() {
				defaultWindowManager = ed.windowManager;
				ed.windowManager = new tinymce.InlineWindowManager(ed);
			});
			
			ed.onPostRender.add(function(ed, cm) {
				// keep track of the last clicked button
		  	$(".mceButton span, .mceButton img").click(function(e) {
					focusedButton = $(e.target).closest(".mceButton");
				});
		  });
		},
				
		getInfo : function() {
			return {
				longname : 'DropDownInlinePopups',
				author : 'Richard Willis',
				authorurl : 'http://badsyntax.co',
 				infourl : 'http://github.com/badsyntax',
				version : '0.1a'
			};
		}
	});

	// Create the window manager
	tinymce.create('tinymce.InlineWindowManager:tinymce.WindowManager', {
		
		InlineWindowManager : function(ed) {
			var t = this;
			t.parent(ed);
			t.zIndex = 300000;
			t.count = 0;
			t.windows = {};
		},

		open : function(f, p) {
			f = f || {};
			p = p || {};
			
			console.log(f,p);
		
			
			// Run native windows
			if (!f.inline) {
				return t.parent(f, p);
			}
				
			var t = this,
					id = DOM.uniqueId(),
					dialog = $('<div />').attr('id', 'dialog-' + id).appendTo('body'),
					w = { id : id, features : f, element: dialog };
					
			dialog.html($("<img src='" + pluginURL + "/img/upArrow.png'/>").css({position: "absolute", top: "-14px", left: "7px"}));		
			t.dialog = dialog;
			dialog.css({
				borderColor: "#82A2DD",
				borderWidth: "5px",
				borderStyle: "solid",
				backgroundColor: "#F6F6F6",
				position: "absolute",
				padding: "5px",
				zIndex: 99999,
				height: f.height ? (f.height + "px") : "auto",
				width: f.width ? (f.width + "px") : "auto"
			}).offset(focusedButton.offset());
			dialog.css({ marginTop: focusedButton.outerHeight() + 13 + "px", marginLeft: "-10px" });
			
			if (f.content) {
				dialog.append(f.content);
				dialog.find("#cancel").click(function() {
					t.close(w, id);
				});
			} else {
				w.iframeElement = $('<iframe />', { id: id + '_ifr', frameborder: 0 }).css({ width: f.width, height: f.height }).appendTo(dialog).attr( 'src', f.url || f.file )[0];
			}
			
			$(document.body).one("click", function(e) {
				focusedButton.click(function(e) {
					dialog.remove();
				});
				$(document.body).click(function(e) {
					if (e.target !== dialog.get(0) && !$.contains(dialog.get(0), e.target)) {
						dialog.remove();
					}
				});
			});
			
			p.mce_inline = true;
			p.mce_window_id = id;
			p.mce_auto_focus = f.auto_focus;

			this.features = f;
			this.params = p;
			this.onOpen.dispatch(this, f, p);
			this.trigger = focusedButton;

			// Add window
			t.windows[id] = w;
			t.count++;
			return w;
		},

		_findId : function(w) {
			var t = this;
			if (typeof(w) == 'string') {
				return w;
			}
			
			each(t.windows, function(wo) {
				var ifr = DOM.get(wo.id + '_ifr');
				if (ifr && w == ifr.contentWindow) {
					w = wo.id;
					return false;
				}
			});

			return w;
		},

		resizeBy : function(dw, dh, id) {
			return;
		},

		focus : function(id) {
			return;
		},

		close : function(win, id) {
			var t = this, w, d = DOM.doc, ix = 0, fw, id;
			id = t._findId(id || win);

			// Probably not inline
			if (!t.windows[id]) {
				t.parent(win);
				return;
			}

			t.count--;
			if (w = t.windows[id]) {
				this.dialog.remove();
			}
		},

		setTitle : function(w, ti) {
			console.log("set title");
		},

		alert : function(txt, cb, s) {
			defaultWindowManager.alert(txt);
		},

		confirm : function(txt, cb, s) {
			return defaultWindowManager.confirm(txt, cb, s);
		}
	});
	
	// Register plugin
	tinymce.PluginManager.add('dropdowninlinepopups', tinymce.plugins.DropdownInlinePopups);
})();