/*jslint browser: true, indent: 2, plusplus: false  */
/*global $, window, alert */
(function($) {
  $.fn.columnfilter = function(rows) {
    return this.each(function(index, table) {
         
      var columns = {},
          headers = $("thead th", table),
          columnControls = $("<div class=\"field column-filter\"><a class=\"action columns-action\"><span>Show Columns</span></a><div class=\"filter-options\"><h4 class=\"filters-head\">Choose " + rows + " Columns To View</h4></div></div>"),
          filterOptions = $(".filter-options", columnControls),
          filterTrigger = $(".columns-action", columnControls),
          isOpen = true;
      
      function toggleFilter(e) {  
        if (!$(this).hasClass("selected") && $(".selected", filterOptions).length >= rows) {
          alert("Only " + rows + " columns can be shown at a time. Please uncheck one of the selected columns");
          return;
        }
    
        columns[$("span", this).text()].toggleClass("hidden");
        $(this).toggleClass("selected");
      }
  
      function hideOptions(e) {
        if (e && $.contains(columnControls.get(0), e.target)) {
          return;
        }
        filterOptions.hide();
        isOpen = false;
      }

  
      function showOptions(e) {
        if (isOpen) {
          hideOptions();
        } else {
          filterOptions.show();
          isOpen = true;
        }
      }  

      table = $(table);
      (function () {
        var i, cells, list, item, column;
        // map the columns
        for (i = 0; i < headers.length; i++) {
          cells = $("tr > *:nth-child(" + (i + 1) + ")", table);
          columns[$(cells.get(0)).text()] = cells;
    
          // hide all columns past #5
          if (i >= rows) {
            cells.addClass("hidden");
          }
        }
    
        if (headers.length === 1) {
          return;
        }
  
        // build the toggle control
        list = $("<ul class=\"filters\"></ul>");
        list.appendTo(filterOptions);
        for (column in columns) {
          if (columns.hasOwnProperty(column)) {
            item = $(["<li class=\"filter\"><span>", column, "</span></li>"].join(""));
            item.appendTo(list);
    
            if (!columns[column].hasClass("hidden")) {
              item.addClass("selected");
            }
            item.bind("click", toggleFilter);
          }
        }
      }());
  
      hideOptions();
      columnControls.appendTo(table.parent().prev());
      filterTrigger.click(showOptions);
      $(document.body).click(hideOptions);
    });
  };
})(jQuery);