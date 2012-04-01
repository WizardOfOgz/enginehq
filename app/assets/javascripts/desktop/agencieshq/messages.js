$(document).delegate(".show-notes-message", "click", function expandMessageComments() {
  var messageNotes = $(this).next(".message-notes");
  if(messageNotes.hasClass('expanded')) {
    messageNotes.removeClass("expanded");
    $(this).html($(this).html().replace("Collapse", "View"));
  } else {
    messageNotes.addClass('expanded');
    $(this).html($(this).html().replace("View", "Collapse"));
  }
});

$(document).delegate(".message-sub-forms .form-title", "click", function expandMessageSubForm() {
  var siblings = $(this).siblings();
  if (!$(this).hasClass("active")) {
    $(this).addClass("active").next().addClass("active").find("textarea").focus();
  } else {
    siblings = siblings.andSelf();
  }
  siblings.removeClass("active");
});

$(document).delegate("#messagesPagingForm input", "click", function(e) {
  HQApp.submitForm($(this).closest("form"), $(this));
  return false;
});

$(document).on('focus', '.message-form .note textarea', function() {
  var textarea = $(this);
  var tab = $('.content-links').find('.selected');
  $(document).one('click', 'a, input', function(e) {
    if(textarea.val() !== '' && !$(this).hasClass('save-action')) {
      e.preventDefault();
      noteConfirmation(textarea, tab);
      // if(!confirm('You have not submitted your note. Would you like to leave this page?')) {
      //   e.preventDefault(); // don't follow the link
      //   e.stopPropagation(); // don't allow other handlers to continue with ajax
      // }
    }
  });
});

$(document).on('focus', '.message-form .note textarea, .message-form .subject input', function() {
  var textarea = $(this); // or input subject
  var tab = $('.content-links').find('.selected');

  // make sure none of the inputs are those in the note form
  var formElements = $(this).parents('form').find('input');
  var bindings = $('a, input').not(formElements);

  bindings.bind('click.preventNavigation', function(e) {

    if(textarea.val() !== '') {
      console.log('note contents', e.isDefaultPrevented(), tab, formElements, bindings);

      if(e.isDefaultPrevented()) { 
      // if there's already an event handler on the element that is preventing the default action
        noteConfirmation(textarea, tab, bindings, false);
      } else { 
        // if there isn't an event handler, we want to allow them to continue with the action, so we pass it along
        e.preventDefault();
        noteConfirmation(textarea, tab, bindings, $(this));
      }

    } else {
      // if note is empty, we don't want to do anything so remove any trace this was here
      bindings.unbind('click.preventNavigation');
    }
  });
});

function noteConfirmation(textarea, tab, bindings, clickedElement) {
/* NOTE:
 *   I didn't style this well because the html will probably be removed to somewhere else. This is basically just to test that it works.
 */
  var html = [
    '<fieldset class="inline-form note-confirmation">',
      '<p>You have an unsent note. Are you sure you want to navigate away from this page?</p>',
      '<a href="#" class="action note-confirm">Hells yeah, that note was stupid.</a>',
      '<a href="#" class="action note-deny">Whoa, wait a sec... I didn\'t actually send that yet?!!11!one!</a>',
    '</fieldset>'
  ].join('');
  $('body').append(html);

  $('.note-confirmation').one('click', 'a', function(e) {
    var $this = $(this);
    e.preventDefault(); // we'll stop the links in the confirmation box from doing anything normally

    // prompt gets removed/hidden regardless of what they select
    $('.note-confirmation').hide().remove();

    // unbind the event so it won't register any more clicks until they reblur the textarea again
    bindings.unbind('click.preventNavigation'); 

    if($this.hasClass('note-deny')) { // we still have reference to the removed object
      // return them to the previous tab (if applicable) and focus the textarea
      tab.find('a').click();
      // cause javascript is stupid
      setTimeout(function() { textarea.focus(); }, 200);
    } else {
      if(clickedElement) { // return the normal browsing path to whatever they were doing
        clickedElement.click(); // force the normal action
      } else {
        // it seems it was an ajax call and we'll just remove the overlay and it should be where they want it
      }
    }
  });
}