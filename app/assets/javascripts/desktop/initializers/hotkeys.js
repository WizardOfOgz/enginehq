// define keys
var keymap = {
  'copy' : 119, // F8
  'edit' : 120, // F9
  'add'  : 115, // F4

  'left' : 37,
  'up'   : 38,
  'right': 39,
  'down' : 40
}

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

    if(e.which === keymap.copy) {
      action = $('.copy-action');
      followUrl(action);
      handleDropdown(action);
    }

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

    // event focus.actionLinks takes over from here
  }
});

$(document).on('focus.actionLinks', '.action-options .option a', function() {
  var $this = $(this);
  var option = $this.parent('.option');

  var previous = option.prev().find('a');
  var next = option.next().find('a');

  $(document).one('keydown.actionLinkKeys', function(e){
    if(e.which === keymap.up) {
      if(previous.length) {
        e.preventDefault();
        previous.focus();
      }
    }

    if(e.which === keymap.down) {
      if(next.length) {
        e.preventDefault();
        next.focus();
      }
    }

    // if(e.which === keymap.right) {
    //   e.preventDefault();
    //   $this.click();
    // }

    // if(e.which === keymap.left) {
    //   e.preventDefault();
    //   option.parents('.action-group').removeClass('active');
    // }
  });
});