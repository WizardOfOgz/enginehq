$(document).delegate("a", "click", function tab(e) { 
  if (this.hash.length < 1) {
    return;
  }
  
  var group = $(this).closest("ul")
    , container = $(this.hash);
  
  // if the container doesn't exist or its a content section, set main tabs
  if (container.length < 1 || container.hasClass("content-section")) {
    group = $("#contentLinks");
    group.children().removeClass("selected").children("a[href$=" + this.hash + "]").parent().addClass("selected");
    
    // Links that are not in the tab menu ALWAYS trigger AJAX calls
    if (!jQuery.contains(group.get(0), this)) {
      container.remove();
      container = null;
    }
  } else {
    $(this).parent().addClass("selected").siblings().removeClass("selected");
  }

  if (!container || container.length < 1) {
    container = $("<div></div>").attr("id", this.hash.substr(1)).css({display: "block"});
    $("#contentSections").append(container);
    HQApp.load(this.href);
  }

  group.find("a").each(function() { 
    $(this.hash).hide(); 
  });

  container.show();

  // save tab selection
  HQApp.setSelectedTab(group.get(0).className, this.hash);

  // selects first tabable field when the tab is selected
  container.find("a, input:not(input[type=hidden]), textarea, select").eq(0).focus();

  e.preventDefault();
});

// $(document).on('blur', '.field-group input, .field-group select, .field-group textarea', function(e) { 
//   var $this=$(this);
//   var $fieldGroup = $this.parents('.field-group');
//   var focusedElement = $this.get(0);
//   var id = $fieldGroup.attr('id');
// 
//   var lastElement = $fieldGroup.find('input, select, textarea');
//   lastElement = lastElement.not(':hidden');
//   lastElement = lastElement.filter(function() {
//     return $(this).css('visibility') !== 'hidden';
//   });
//   lastElement = lastElement.last().get(0);
// 
//   if(focusedElement === lastElement) {
//     var $fieldGroupIndex = $('.field-group-index');
//     var $tab = $fieldGroupIndex.find('li').find('a[href$=#'+id+']');
//     var $nextTab = $tab.parent('li').next().find('a');
// 
//     var lastFGElement = $fieldGroupIndex.find('li').last().find('a').get(0);
//     var tabElement = $tab.get(0);
// 
//     if(lastFGElement !== tabElement) {
//       e.preventDefault();
//       $nextTab.focus();
//     }
//   }
// });

$(document).on('keydown.tab', '.field-group input, .field-group select, .field-group textarea, .field-group h4', function(e) { 
  if(e.which === 9) { // tab key
    var $this=$(this);
    var $fieldGroup = $this.parents('.field-group');
    var focusedElement = $this.get(0);
    var id = $fieldGroup.attr('id');

    var lastElement = $fieldGroup.find('input, select, textarea, button, h4');
    lastElement = lastElement.not(':hidden');
    lastElement = lastElement.filter(function() {
      return $(this).css('visibility') !== 'hidden';
    });
    lastElement = lastElement.last().get(0);

    if(focusedElement === lastElement) {

      var $fieldGroupIndex = $('.field-group-index');
      var $tab = $fieldGroupIndex.find('li').find('a[href$=#'+id+']');
      var $nextTab = $tab.parent('li').next().find('a');

      var lastFGElement = $fieldGroupIndex.find('li').last().find('a').get(0);
      var tabElement = $tab.get(0);

      if(lastFGElement !== tabElement) {
        e.preventDefault();
        $nextTab.focus();
      }
    }
  }
});

