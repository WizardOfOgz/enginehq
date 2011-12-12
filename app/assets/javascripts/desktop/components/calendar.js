/*jslint browser: true, indent: 2 */
/*global $, window */

(function () {  
  var weekdays = ["S", "M", "T", "W", "T", "F", "S"],
  container = $(["<div class=\"calendar-control\"><p class=\"header\">Select Date</p><ul class=\"date-control month\"><li class=\"link previous\"><a href=\"#\">View Previous Month</a></li><li class=\"link next\"><a href=\"#\">View Next Month</a></li></ul><ul class=\"date-control year\"><li class=\"link previous\"><a href=\"#\">View Previous Year</a></li><li class=\"link next\"><a href=\"#\">View Next Year</a></li></ul><table class=\"dates\"><caption class=\"title\"><span class=\"month\"></span>&nbsp;<span class=\"year\"></span></caption><thead><tr class=\"row weekdays\"><th>", weekdays.join("</th><th>"), "</th></tr></thead><tbody></tbody></table></div>"].join("")),
  monthTitle = $(".title .month", container),
  yearTitle = $(".title .year", container),
  body = $("tbody", container),
  selectedYear,
  selectedMonth,
  focusInput = null,
  formInputs = null,
  yearControl = $(".date-control.year", container),
  eventTarget = null,
  monthControl = $(".date-control.month", container),
  dblclick;

  /**
  * Sets the input to focus the calendar onto. 
  *
  * @private
  */
  function setFocusInput(input) {
    focusInput = input;
  }

  /**
  * Gets the input to focus the calendar onto.
  *
  * @private
  */
  function getFocusInput() {
    return focusInput;
  }

  /**
  * Sets the form inputs being set by the calendar.
  * @param {Object} inputs The object mapping the inputs to their type.
  * inputs.day {Node} The input containing the day.
  * inputs.month {Node} The input containing the month.
  * inputs.year {Node} The input containing the year.
  * inputs.date {Node} The input to contain day, month, and year.
  *
  * @private
  */
  function setFormInputs(inputs) {
    formInputs = inputs;
  }
  
  /**
  * Sets the form inputs being set by the calendar.
  * @return {Object} inputs The object mapping the inputs to their type.
  * inputs.day {Node} The input containing the day.
  * inputs.month {Node} The input containing the month.
  * inputs.year {Node} The input containing the year.
  * inputs.date {Node} The input to contain day, month, and year.
  *
  * @private
  */
  function getFormInputs() {
    return formInputs;
  }

  /**
  * Sets the selected year.
  * @param {int} year The 4 digit year to  set (e.g. 2010).
  *
  * @private
  */
  function setYear(year) {
    selectedYear = year;
  }

  /**
  * Sets the selected month.
  * @param {int} month The index of the month to select (0 = January, ..., 11 = December).
  *
  *  @private
  */
  function setMonth(month) { 
    selectedMonth = month;
  }

  /** 
  * Sets the date to the given year and month.
  * @param {int} year The 4 digit year (e.g. 2010) to set the date to.
  * @param {int} month The month to set the date to (0 == January, 11 = December)
  */
  function setDate(year, month) {
    selectedYear = year;
    selectedMonth = month;
  }

  /**
  * Gets the selected year.
  * @return {int} The 4-digit selected year (e.g. 2010).
  *
  * @private
  */
  function getYear() {
    return selectedYear;
  }
  
  /**
  * Gets the selected month.
  * @return {int} The index of the selected month. (0 = January, ..., 11 = December)
  *
  * @private
  */
  function getMonth() {
    return selectedMonth;
  }
  
  function setMonthPaging() { 
    // set the title active
    monthTitle.addClass("active");
    yearTitle.removeClass("active");

    // set active control
    monthControl.addClass("active-control");
    yearControl.removeClass("active-control");
  }

  function setYearPaging() {
    // set the title active
    yearTitle.addClass("active");
    monthTitle.removeClass("active");

    // set active control
    yearControl.addClass("active-control");
    monthControl.removeClass("active-control");
  }

  function selectDate() {
    var value = this.innerHTML,
    inputs;

    if (value && value.length > 0) {
      inputs = getFormInputs();
      inputs.day.value = value;
      inputs.month.value = getMonth() + 1;
      inputs.year.value = getYear();
      close();
    }
  }

  /**
  * 
  */
  function hoverOn() {
    if (this.innerHTML.length > 0) {
      $(this).addClass("hover");
    }
  }

  /**
  *
  */
  function hoverOff() {
    $(this).removeClass("hover");
  }

  /**
  * Determines if the given year is a leap year.
  * @param {int} year The complete year (e.g. 2010) to determine if it is a leap year or not.
  * 
  * @private
  */
  function isLeapYear(year) {
    if (year % 4 === 0) { 
      if (year % 100 === 0) {
        return year % 400 === 0;
      }
      return true;
    }
    return false;
  }

  /**
  * Positions the calendar near (left or right) of the given node. The calendar will have a preference of being aligned to the right.
  *
  * @private
  */
  function position() {
  
    if (!getFocusInput() || getFocusInput().length < 1) {
      return;
    }

    var node = getFocusInput(),
    // get the bounding boxex/position of the given node
    nodeOffset = node.offset(),
    height = node.outerHeight(),
    width = node.outerWidth(true),
    wrap = $("#appWrap"),
    wrapOffset = wrap.offset(),
    wrapWidth = wrap.outerWidth(true),
    // Determine the spacing from the input to the page wrap
    leftSpace = nodeOffset.left - wrapOffset.left,
    rightCorner = leftSpace + width,
    rightSpace = wrapWidth - rightCorner,
    calendarWidth = container.outerWidth(true),
    isAlignedOnRight = rightSpace > calendarWidth,
    // variables for calculation
    input,
    inputOffset;
    
    // The calendar has a preference of beign right aligned.
    input = $("input:eq(2)", node);
    inputOffset = input.offset();
    container.css({
      "top" : inputOffset.top + "px",
      "left" : (inputOffset.left + input.outerWidth()) + "px"
    });
  }

  /**
  * Gets the days in a given month in a given year.
  * @param {int} month The month to retrieve the days in month for. The months are indexed starting with 0. (0 = January,..,11 = December)
  * @param {int} year The complete year (e.g. 2010) to retrieve the day count for the given month. The year is needed to determine a leap year.
  *
  * @private
  */
  function getDaysInMonth(month, year) {
    var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], count = days[month];
    // Add 1 more day if it is February and a leap year
    return (month === 1 && isLeapYear(year)) ? (count + 1) : count;
  }

  /**
  * Gets the text for the given month.
  * @param {int} index The 0 based index of the month to retrieve the text for (0 = January, ..., 11 = December)
  * @return The text for the given month (e.g. January, February, .., December)
  *
  * @private
  */
  function getMonthText(index) {
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[index];
  }

  /**
  * Updates the dates of the calendar with the current set date. This method should be called whenver a date value is changed.
  * 
  * @private
  */
  function update() {
    
    var month = getMonth() 
      , year = getYear()
      
        // Retrieve Info for painting date cells
      , startIndex = new Date(year, month, 1).getDay()
      , dayCount = getDaysInMonth(month, year)
      , rows
      , totalCount = startIndex + dayCount
      , today = new Date()
      , isThisMonth = (today.getMonth() === month && today.getFullYear() === year)
      , index = 0
      , stringBuilder = []
    
        // Variables used to build table cell 
      , row = 0 
      , cell = 0 
      , cells
      , newBody
      , dateValue
      , selectionInMonth = (parseInt(formInputs.month.value) - 1) == month && parseInt(formInputs.year.value) == year;
    
 
    // Paint new Headers
    yearTitle.empty().html(year);
    monthTitle.empty().html(getMonthText(month));

    if (totalCount === 28) {
      rows = 4;
    } else if (totalCount < 35) {
      rows = 5;
    } else {
      rows = 6;
    }

    for (row = 0; row <= rows; row += 1) {
      stringBuilder.push('<tr class=\"row week\">');
      for (cell = 0; cell < 7; cell += 1) {
        if (index >= startIndex && index < totalCount) {
          dateValue = index - startIndex + 1;
          if (selectionInMonth && dateValue == parseInt(formInputs.day.value)) {
            stringBuilder.push("<td class=\"day selected\">");
          } else if (isThisMonth && dateValue === today.getDate()) {
            stringBuilder.push("<td class=\"day today\">");
          } else {
            stringBuilder.push("<td class=\"day\">");
          }
          stringBuilder.push(dateValue);
        } else { 
          stringBuilder.push('<td>');
        }
        stringBuilder.push('</td>');
        index += 1;
      }
      stringBuilder.push('</tr>');
      if (index >= totalCount) {
        break;
      }
    }
    $("td", body).unbind();
    body.children().remove();
    newBody = $("<tbody></tbody>").append($(stringBuilder.join('')));
    newBody.hide().insertAfter(body);
    body.remove();
    newBody.css({
      "display" : ""
    });
    body = newBody;
    
    $("td", body).bind({
      "mouseover" : hoverOn,
      "mouseout" : hoverOff,
      "click" : selectDate
    });
  }

  /**
  * Paging event for the years.
  * @param {Event} e The event that triggered the page.
  *
  * @private
  */
  function pageYear(e) {
    if ($(this).parent().hasClass("next")) {
      setYear(getYear() + 1);
    } else {
      setYear(getYear() - 1);
    }
    update();
    e.preventDefault();
  }

  /**
  * Paging event for the months.
  * @param {Event} e The event that triggered the page.
  *
  * @private
  */
  function pageMonth(e) {
    var month = getMonth();
    if ($(this).parent().hasClass("next")) {
      if (month === 11) { 
        setMonth(0);
        setYear(getYear() + 1);
      } else {
        setMonth(month + 1);
      }
    } else {
      if (month === 0) {
        setMonth(11);
        setYear(getYear() - 1);
      } else {
        setMonth(month - 1);
      }
    }
    update();
    e.preventDefault();
  }


  function open() {
    getFocusInput().addClass("calendar-focus");
    position();
    container.show();
    update();
  }

  function close(e) {
    if (e && ($.contains(container.get(0), e.target))) {
      return;
    }
    
    if (e && focusInput && $.contains(focusInput.get(0), e.target)) {
      return;
    }
    
    if (focusInput) {
      getFocusInput().removeClass("calendar-focus");
    }
    container.hide();
    eventTarget = null;
    setFocusInput(null);
    setFormInputs(null);
  }

  $("a", monthControl).click(pageMonth);
  $("a", yearControl).click(pageYear);
  monthTitle.click(setMonthPaging);
  yearTitle.click(setYearPaging);

  $(document).ready(function () {
    $(document.body).append(container);
    setMonthPaging();
    $(window).bind("resize", position);
    container.hide();
    
  });
  
  $(document).bind("click", close);
  
  /**
  * Listens to the 'openCalendar' event opens the calendar to the given input.
  * @param {Node} node The node or container of nodes, the calendar is focusing upon.
  * @param {Object} inputs The object mapping the inputs to their type.
  * inputs.day {Node} The input containing the day.
  * inputs.month {Node} The input containing the month.
  * inputs.year {Node} The input containing the year.
  */
  $(document).bind("openCalendar", function (event, node, inputs) { 
    
    
    setTimeout(function() { dblclick = false; }, 500);

    if (eventTarget === event.target) {
      close();
      
      // set calendar to today on double click
      if(dblclick) {
        var today = new Date();
        inputs.day.value = today.getDay();
        inputs.month.value = today.getMonth();
        inputs.year.value = today.getFullYear();
        setFormInputs(inputs);
        var dblclickSelection = window.getSelection();
        dblclickSelection.collapse();
       }
       
       return false;
    }
    
    dblclick = true;

    close();
    eventTarget = event.target;
    setFocusInput(node);
    setFormInputs(inputs);
    position();

    var day = parseInt(inputs.day.value, 10)
      , month = parseInt(inputs.month.value, 10) 
      , year = parseInt(inputs.year.value, 10)
      , date = new Date();
        
    day = isNaN(day) ? date.getDay() : day;
    month = isNaN(month) ? date.getMonth() : (month - 1);
    year = isNaN(year) ? date.getFullYear() : year;

    setDate(year, month);
    open();
  });
}());