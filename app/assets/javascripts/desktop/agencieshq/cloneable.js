/*jslint browser: true, indent: 2 */
/*global $, window */
var Cloneable = (function () {

  var tagAttributes = [];
  // purposely left out attributes I didnt' want to clone. These include (events, callbacks, xml spaces, name, value, id). Name and value are calculated.
  tagAttributes.all = ["title", "class", "style", "disabled", "tabindex"];
  tagAttributes.textarea = ["cols", "rows", "readonly", "accesskey", "inputmode"];
  tagAttributes.checkbox = tagAttributes.radio = ["alt", "size", "readonly", "type", "accesskey", "inputmode", "value"];
  tagAttributes.text = ["accept",  "alt", "size", "readonly", "type", "accesskey", "inputmode", "maxlength"];
  tagAttributes.select = ["size", "multiple"];
  tagAttributes.hidden = ["type"];

  /**
  * Appends the name and value onto the given String.
  * @param {String} out The output to append the name/value pair onto.
  * @param {String} name The name of the value to append.
  * @param {String} value The value to append.
  * @return {String} The given String with the name value pair appended.
  *
  * @private
  */
  function appendValue(out, name, value) {
    if (value) {
      return [out, " ", name, "='", value, "'"].join("");
    }
    return out;
  }

  /**
  * Converts the given node into a HTML String.
  * @param {String} tag
  * @param {Node} node
  */
  function toHTML(tag, node, newName)  {
    var html = "<" + tag, 
    attributes = tagAttributes.all.concat([]), 
    i = 0, 
    attribute,
    attributeValue;
    
    if (tag === "select") {
      attributes = attributes.concat(tagAttributes.select);
    } else if (tag === "textarea") {
      attributes = attributes.concat(tagAttributes.textarea);
    } else {
      attributes = attributes.concat(tagAttributes[node.type]);
    }

    html = appendValue(html, "name", newName);
    for (i = 0; i < attributes.length; i = i + 1) {
      attribute = attributes[i];

      attributeValue = $(node).attr(attribute === "class" ? "className" : attribute);
      if (attribute === "maxlength" && attributeValue === -1) {
        continue;
      }

      html = appendValue(html, attribute, attributeValue);
    }

    if (tag === "input") {
      html += "/>";
    } else if (tag === "select") {
      html += "></select>";
    } else if (tag === "textarea") {
      html += "></textarea>";
    }

    return html;
  }


  function incrementInput(parent, tag) {
    $(tag, parent).each(function () {
      var input = this, 
      regex = /\[\d+\]/,
      name = input.name, // the name of the new input
      match = name.match(regex),
      safeCopy, // the newly constructed tag to replace the cloned version
      value;

      if (match && match.length > 0) { // The name needs to be incremented
        match = match.join("");
        name = name.replace(regex, ["[", parseInt(match.substr(1, match.length - 2), 10) + 1, "]"].join(""));
      } else if (input.type === "radio") { // If the name is not being incremented, and its a radio button, increment the value if it is an int
        value = parseInt(input.value, 10);
        value = isNaN(value) ? null : value + 1;
      }
      
      
      safeCopy = $(toHTML(tag, input, name));
      if (tag === "select") {
        $(input).children().appendTo(safeCopy);
      }
      
      $(input).replaceWith(safeCopy);
      
      // The selected index has to be set after it is appended to the DOM
      if (tag === "select") {
        safeCopy.attr("selectedIndex", -1);
      }
      
      if (value) {
        safeCopy.attr("value", value);
      }
          
    });
  }

  /**
  * Clone
  * @param e Event 
  * @param action The anchor that triggered the clone
  * @param cloneable The cloneable item
  */
  function createClone(e, action, cloneable) {
    // hide clone trigger
    var container = action.parent(), 
    moveTrigger = (container.parent().get(0) === cloneable.get(0)),
    parent,
    clone,
    is;
    
    if (moveTrigger) {
      container.appendTo(document.body).css({
        display : "none"
      });
    }

    // clone item and show all children	
    parent = cloneable.parent();
    (parent.attr("tagName") === "TBODY" ? parent.parent() : parent).addClass("cloned");
    
    clone = $(cloneable.clone());
    clone.children().css({
      "display" : ""
    });


    // Toggle Zebra Striping
    if (cloneable.hasClass("odd")) {
      cloneable.removeClass("odd");
      cloneable.addClass("even");
    } else if (cloneable.hasClass("even")) {
      cloneable.removeClass("even");
      cloneable.addClass("odd");
    }

    // cant use .hide() and fadeIn() as jquery sets display to block and this messes up table rows
    //	clone.css('opacity',0).insertBefore(cloneable).animate({opacity : 1}, "fast", null, function(){clone.removeAttr('style');});
    clone.hide().insertBefore(cloneable).fadeIn("fast", function () {
          // put focus on the first input in the cloned node if an event triggered the clone
      if (e) {
        is = $(".inp", clone)[0];
        if (is) {
          is.focus();
        }
      }
    });
    clone.css({
      "display" : ""
    });
    clone.removeClass("clone");
    
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    

    if (moveTrigger) {
      // put trigger back on and display
      container.appendTo(cloneable).css({
        "display" : ""
      });
    }
    

    //setType(jI, clone);

    incrementInput(cloneable, "input");
    incrementInput(cloneable, "select");
    incrementInput(cloneable, "textarea");
    
    // Trigger the cloned event
    clone.trigger("cloned", [clone]);	
  }

  /**
  * Sets the input type onto the clone inputs. This is a hack to get around a bug in IE7.
  * @param {Element} original The element that created the clone.
  * @param {Element} clone The cloned element.
  *
  * @private
  */ 
  function setType(original, clone) {
    $("input", original).each(function () {
      var type = $(this).attr("type"),
      name = $(this).attr("name"),
      value = $(this).attr("value"),
      className = $(this).attr("className"),
      clonedInput = $("input[name='" + name + "']", clone);

      $(clonedInput).replaceWith("<input type='" + type + "' name='" + name + "' value='" + value + "' class='" + className + "'/>");
    });
  }

  /**
  * Initializes cloneable onto a cloneable context. The item to make cloneable should be in context of 'this'.
  *
  * @private
  */
  function initCloneable() {
    var clone = $(this), action, parent;
    
    //clone.css({backgroundColor : "#FFFFFF"});		
    clone.children().css({
      "display" : "none"
    });

    action = $("<a class=\"action clone-action\" href=\"#\"><span>Add</span></a>");
    
    if (clone.closest(".sub-field-group").length > 0) {
      action.insertAfter(clone.closest(".field-list"));
    } else {
      action.appendTo($(".field-group-head", clone.closest(".field-group")));
    }
    /* if (clone.attr("tagName") === "TR") {
      parent = clone.parents("table");
      actions.insertAfter(parent);
    } 
    else {
      clone.append(actions);
    }*/

    action.click(function (e) {
      createClone(e, $(this), clone);
    });

    if (clone.hasClass("clone")) {
      createClone(null, action, clone);
    } else {
      clone.addClass("clone");
    } 
  }

  return {
    setup : function (e) {
      $("tr.cloneable, li.cloneable", e).each(initCloneable);
    }
  };
}());