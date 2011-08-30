(function($) {
  
  var regex = new RegExp("^\\$?\\d+(\\.(\\d{1,3}))?$"),
      methods = {
        
    init : function(options) {
    },
    
    sum : function(negatable) {
      var summables = $(this),
          total = 0,
          value;
            
      summables.each(function(index, summable) {
        value = $(summable).spreadsheet("parseNumber", negatable);
        total = isNaN(value) ? total : value + total;
      });
          
      return total.toFixed(2);
    },
    
    multiply : function() {
      var summables = $(this),
          total = null,
          value;
            
      summables.each(function(index, summable) {
        value = $(summable).spreadsheet("parseNumber");
        if(!isNaN(value)) {
          total = total === null ? value : total * value;
        }
      });
          
      return total == null ? 0 : total.toFixed(2);
    },
    
    parseNumber : function(negatable) {
      var negate = false; 
      value = $(this).val();
      value = value.length < 1 ? $(this).eq(0).text() : value;

      // If the value is only a $, interpret it as $0
      value = value.replace("$", "").replace(/,/g, "");
      value = value.length === 0 ? "0" : value;

      // If the last character in the value is ".", interpret it as .0
      value = value.substr(value.length - 1,1) === "." ? value + "0" : value;
      if (negatable) { // +/- are legal symbols
        if (value.substr(0,1) === "-") {
          negate = true;
          value = value.replace('-', "");
        } else if (value.substr(0,1) === "+") {
          value = value.replace('+', "");
        }
      }
      
      value = value.substr(0,1) === "." ? "0" + value : value;      
      value =  (regex.test(value) && value !== "" && value !== ".") ? (parseFloat(value, 10) * (negate ? -1 : 1)) : Number.NaN;
    
      if (isNaN(value)) {
        $(this).trigger("validationError");
      }
      
      return value;
    },
    
    insertCommas : function() {
      var nStr;
      
      if (this.attr("nodeName") === "INPUT") {
        nStr = $(this).val();
      } else {
        nStr = $(this).eq(0).text();
      }
        
      var x, x1, x2, rgx;

      nStr += '';
      x = nStr.split('.');
      x1 = x[0];
      x2 = x.length > 1 ? '.' + x[1] : '';
      rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
      }
      
      if (this.attr("nodeName") === "INPUT") {
        $(this).val(x1 + x2);
      } else {
        $(this).html(x1 + x2);
      }
      return this;
    },
    
    insertDollar : function() {
      var value;
      if (this.attr("nodeName") == "INPUT") {
        value = $(this).val();
        if (value.substr(0,1) !== "$") {
          $(this).val(("$" + value).replace("$-", "-$"));
        }
      } else {
        value = $(this).eq(0).text();
        if (value.substr(0,1) !== "$") {
          $(this).html(("$" + value).replace("$-", "-$"));
        }
      }
      return this;
    }
  };
  
  
  $.fn.spreadsheet = function(method) {
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } 
  };  
})(jQuery);