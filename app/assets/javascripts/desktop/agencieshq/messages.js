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

  // make sure none of the inputs are those in the message form
  var formElements = $(this).parents('form').find('input');
  var submitElement = $(this).parents('form').find('input[type=submit]');
  var bindings = $('a, input').not(formElements);

  bindings.bind('click.preventNavigation', function(e) {

    if(textarea.val() !== '') {

      if(e.isDefaultPrevented()) { 
      // if there's already an event handler on the element that is preventing the default action
        messageConfirmation(textarea, tab, bindings, false);
      } else { 
        // if there isn't an event handler, we want to allow them to continue with the action, so we pass it along
        e.preventDefault();
        messageConfirmation(textarea, tab, bindings, $(this));
      }

    } else {
      // if message is empty, we don't want to do anything so remove any trace this was here
      bindings.unbind('click.preventNavigation');
    }
  });

  submitElement.bind('click.cancelMessagePrompt', function(e) {
    // reset everything so it won't be called again
    submitElement.unbind('click.cancelMessagePrompt');
    bindings.unbind('click.preventNavigation');
  });
});

function messageConfirmation(textarea, tab, bindings, clickedElement) {

  // unbind the event so it won't register any more clicks until they reblur the textarea again
  bindings.unbind('click.preventNavigation'); 

  var html = [
    '<fieldset class="inline-form message-confirmation">', 
      '<legend class="inline-form-head">Message Confirmation</legend>', 
      '<div class="content-alerts content-warnings">', 
        '<h4 class="title">You have an message that was not saved or sent...</h4>', 
      '</div>', 
      '<p class="form-actions">', 
        '<a class="action message-back" href="#">Please take me back!</a>', 
        '<a class="cancel-link" href="#">cancel</a>', 
      '</p>', 
    '</fieldset>'].join('');

  if($('.message-confirmation').length === 0) {
    // we want to make sure only one overlay gets created
    $('body').append(html);
  }
  
  $('.message-confirmation').one('click', 'a', function(e) {
    var $this = $(this);
    e.preventDefault(); // we'll stop the links in the confirmation box from doing anything normally

    // prompt gets removed/hidden regardless of what they select
    $('.message-confirmation').hide().remove();

    if($this.hasClass('message-back')) { // we still have reference to the removed object
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
