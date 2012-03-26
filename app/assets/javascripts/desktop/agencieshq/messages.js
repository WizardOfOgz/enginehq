$(document).on('focus', '.message-form .note textarea', function() {
  var textarea = $(this);
  $(document).one('click', 'a, input', function(e) {
    if(textarea.val() !== '' && !$(this).hasClass('save-action')) {
      if(!confirm('You have not submitted your note. Would you like to leave this page?')) {
        e.preventDefault(); // don't follow the link
        e.stopPropagation(); // don't allow other handlers to continue with ajax
      }
    }
  });
});
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