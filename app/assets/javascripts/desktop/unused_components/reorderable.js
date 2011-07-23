(function($) {
  $.fn.reorderable = function() {
    return this.each(function(index, table) {
  
      table = $(table)
      var headers,
          activeColumn = null,
          activeHeader = null,
          activeIndex = -1,
          preview = null,
          previewOffset = null,
          maxX = 0,
          minX = 0, 
          tableWidth = 0;
      
      /**
      * Update the column being moved
      * This method is called with every x/y direction change. It shoudld contain minimal logic.
      */
      function dragColumn(e) {
        e.preventDefault();
        moveColumnTo(findColumn(e.pageX));
    
        var left = e.pageX + previewOffset.x;
        left = left < minX ? minX : left;
        left = left > maxX ? maxX : left;
    
        preview.css({
          "left" : left + "px",
          "visibility" : "visible"
        });
      }
  
      /**
      * Generates a preview of the table column being dragged.
      * @param {Event} event The event that triggered the column drag.
      */
      function createPreview(event) {
    
        previewOffset = {
          "x" : $(activeHeader).offset().left - event.pageX,
          "y" : $(activeHeader).offset().top - event.pageY
        };
    
        preview = $(table).clone(false);
        $("td", preview).not("td:nth-child(" + (activeIndex + 1) + ")").remove();
        $("th", preview).not("th:nth-child(" + (activeIndex + 1) + ")").remove();
    
        // Some browsers won't maintain the height of the table cells if they are empty.. force the correct height
        $("th", preview).height($(activeHeader).height());
        var cells = $("td", preview);
        cells.css({"opacity" : 1});
        activeColumn.each(function(index, td) {
          $(cells.get(index)).height($(td).height());
        });
  
        preview.css({
          "height" : $(table).height() + "px",
          "width" : $(activeHeader).width() + "px",
          "position" : "absolute",
          "top" : $(activeHeader).offset().top,
          "zIndex" : 9999,
          "visibility" : "hidden",
          "backgroundColor" : "#FFFFFF"
        }).fadeTo(1, .8);
    
        preview.appendTo(document.body);
      }
  
      /**
      * Capture the column to draw
      */
      $("thead th", table).mousedown(function(e) {
        // These values are calculated on click in case the table is hidden.. it would throw off the metrics
        headers = $("thead th", table).not(":hidden");
        minX = $(table).offset().left;
        tableWidth = $(table).width();
      
        activeIndex = headers.index(this);
        activeColumn = $("tbody td:nth-child(" + (activeIndex + 1) + ")", table);
        activeHeader = this;
        maxX = minX + tableWidth - $(activeHeader).width();
    
        createPreview(e);

        $(document).bind("mousemove", dragColumn);
        $(document).bind("mouseup", dropColumn);
        $(document).bind("selectstart", disableTextSelection);
        return false;
      });
  
      /**
      * Move the draggable column
      */
      function dropColumn(e) {
    
        $(document).unbind("mousemove", dragColumn);
        $(document).unbind("mouseup", dropColumn);
        $(document).unbind("selectstart", disableTextSelection);
    
        $(activeHeader).removeClass("moving");
        $(activeColumn).removeClass("moving");
    
        preview.remove();
    
        activeColumn = activeHeader = preview = previewoffset = null;
        activeIndex = minX = maxX = -1;
      };
  
      /**
      * Move the draggable column
      */
      function disableTextSelection() {
        return false;
      }
  
  
      /**
      * Find the column at the x position
      */
      function findColumn(x) {
        var column = -1;
        headers.each(function(index, header) {
          var offset = $(header).offset();
          if (x-offset.left < $(header).outerWidth(true)) {
        
            if (index > activeIndex) {
              if (x-offset.left > $(header).outerWidth(true)/2) {
                column = index;
              }
            } else {
              if (x-offset.left < $(header).outerWidth(true)/2) {
                column = index;
              }
            }
            return false;
          }
        });
        return column;
      }
  
  
      /**
      * Moves the column to the target index.
      */
      function moveColumnTo(dropTargetIndex) {
        if (dropTargetIndex === -1 || activeIndex === dropTargetIndex) {
          return;
        } 

        var moveAfter = activeIndex < dropTargetIndex;
        activeIndex = moveAfter ? activeIndex + 1 : activeIndex - 1;
    
        $(activeHeader).addClass("moving");
        $(activeColumn).addClass("moving");
  
  
        // massive reflows will follow, hide this sucker
        table.css({"position" : "absolute", "visibility" : "hidden" });
        if (moveAfter) {
          $(activeHeader).insertAfter(headers.get(dropTargetIndex));
        } else {
          $(activeHeader).insertBefore(headers.get(dropTargetIndex));
        }
    
        $(activeColumn).each(function(index, cell) {
          var targetCell = $("td:nth-child(" + (dropTargetIndex + 1) +  ")", cell.parentNode);
          if (moveAfter) {
            $(cell).insertAfter(targetCell);
          } else {
            $(cell).insertBefore(targetCell);
          }
        });
    
        // show it agian
        table.css({"position" : "", "visibility" : "" });
        headers = $("thead th", table).not(":hidden");
      }
    });
  }; 
})(jQuery);