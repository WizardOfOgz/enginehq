// define keys
var keymap = {
  'edit' : 120, // F9
  'add'  : 119, // F8
  'up'   : 38,  // up arror
  'down' : 40   // down arrow
}

// event.shiftKey for shift

// map keys
keymap.allKeys = [];
for(var key in keymap) {
  keymap.allKeys.push(keymap[key]);
}
var optNumber = false; // for arrow keys on edit button

// keydown.shortcuts is namespaced so we can disable them if needed by calling:
// $(document).off('keydown.shortcuts');
$(document).on('keydown.shortcuts', function(e) {
  // check to see if key used is a shortcut key
  if(keymap.allKeys.indexOf(e.which) > -1) {
    var action = false;
    if(!e.shiftKey) {
      if(e.which === keymap.edit) {
        action = $('.edit-action');
        followUrl(action);
        handleDropdown(action);
      }
    
      if(e.which === keymap.add) {
        action = $('.add-action');
        followUrl(action);
        handleDropdown(action);
      }
    }
    
    // shift key + F? key
    if(e.shiftKey) {
      var activeSection = $('.content-links .selected a').get(0).hash;
      if(e.which === keymap.edit) {
        action = $(activeSection+' .records-actions .edit-action');
        followUrl(action);
        handleDropdown(action);
      }
      
      if(e.which === keymap.add) {
        action = $(activeSection+' .records-actions .add-action');
        followUrl(action);
        handleDropdown(action);
      }
    }
    
  }

  function followUrl(action) {
    // if action has href, follow it
    // click() doesn't work on these for whatever reason
    var url = action.eq(0).attr('href');
    if(url) window.location.assign(url);
  }

  function handleDropdown(action) {
    if(!action.hasClass('action-group'))
      action = action.parent('.action-group');

    action.toggleClass('active');
    if(action.hasClass('active'))
      action.find('.action-options').find('.option a').eq(0).focus();

    // hide drop down if you click anywhere on the page
    $(document).one('click', function() {
      action.removeClass('active');
    });

    // event focus.actionLinks takes over from here
  }
});

$(document).on('focus.actionLinks', '.action-options .option a', function() {
  var $this = $(this);
  var option = $this.parent('.option');

  var previous = option.prev().find('a');
  var next = option.next().find('a');

  arrowKeys();
  
  function arrowKeys() {
    $(document).one('keydown.actionLinkKeys', function(e){
      if(e.which === keymap.up) {
        if(previous.length) {
          e.preventDefault();
          previous.focus();
        } else {
          e.preventDefault(); // stop the page from moving down/up
          arrowKeys();
        }
      }

      if(e.which === keymap.down) {
        if(next.length) {
          e.preventDefault();
          next.focus();
        } else {
          e.preventDefault(); // stop the page from moving down/up
          arrowKeys();
        }
      }
    });
  }
});