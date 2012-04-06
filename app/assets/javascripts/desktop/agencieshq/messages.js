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
    $(this).addClass("active").next().addClass("active").find("input[type=text], input[type=submit], input[type=checkbox], input[type=radio], select, textarea").eq(0).focus();
  } else {
    siblings = siblings.andSelf();
  }
  siblings.removeClass("active");
});

$(document).delegate("#messagesPagingForm input", "click", function(e) {
  HQApp.submitForm($(this).closest("form"), $(this));
  return false;
});

$(document).on('focus', '.message-form .note textarea, .message-form .subject input', function() {
  var textarea = $(this); // or input subject
  var tab = $('.content-links').find('.selected');

  // make sure none of the inputs are those in the note form
  var formElements = $(this).parents('form').find('input');
  var bindings = $('a, input').not(formElements);

  bindings.bind('click.preventNavigation', function(e) {

    if(textarea.val() !== '') {
  
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

 var html = [
  '<fieldset class="inline-form note-confirmation">', 
    '<legend class="inline-form-head">Message Confirmation</legend>', 
    '<div class="content-alerts content-errors">', 
      '<h4 class="title">You have an message that was not saved or sent...</h4>', 
    '</div>', 
    '<p class="form-actions">', 
      '<a class="action" href="#">Please take me back!</a>', 
      '<a class="cancel-link note-cancel" href="#">cancel</a>', 
    '</p>', 
  '</fieldset>'].join('');
  $('body').append(html);

  $('.note-confirmation').one('click', 'a', function(e) {
    var $this = $(this);
    e.preventDefault(); // we'll stop the links in the confirmation box from doing anything normally

    // prompt gets removed/hidden regardless of what they select
    $('.note-confirmation').hide().remove();

    // unbind the event so it won't register any more clicks until they reblur the textarea again
    bindings.unbind('click.preventNavigation');

    if($this.hasClass('note-cancel')) { // we still have reference to the removed object
      // return them to the previous tab (if applicable) and focus the textarea
      tab.find('a').click();
    } else {
      if(clickedElement) { // return the normal browsing path to whatever they were doing
        if(clickedElement.is('a')) {
          var url = clickedElement.attr('href');
          window.location.assign(url);
        } else {
          clickedElement.click(); // force the normal action
        }
      }
    }
  });
}