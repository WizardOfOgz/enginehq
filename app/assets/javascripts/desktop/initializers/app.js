$(document).delegate("a[rel=external]", "click", function openExternalLink(e) {
  window.open(this.href);
  e.preventDefault();
});

// Open the action group when clicked
$(document).delegate(".action-group", "click", function openActionGroup(e) {
  var self = $(this);
  if (self.hasClass("active")) {
    self.removeClass("active");
    return;
  }

  self.addClass("active");
  $(document).one("click", function() {
    self.removeClass("active");
  });
});

$(document).delegate(".main-account .menu-link", "click", function openAccountMenu(e) {
  var menu = $(this);
  if (menu.hasClass("open")) {
    menu.removeClass("open");
  } else {
    menu.addClass("open");
    $(document).one("click", function() {
      menu.removeClass("open");
    });
  }
});

$(document).delegate("li.main-navigation-menu .title", "click", function openNavigationMenu(e) {
  var parent = $(this).parent();
  if (parent.hasClass("open")) {
    parent.removeClass("open");
    return;
  }

  parent.addClass("open");
  $(document).one("click", function() {
    parent.removeClass("open");
  });
});