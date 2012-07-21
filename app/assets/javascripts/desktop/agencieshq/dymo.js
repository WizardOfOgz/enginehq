$(function() {
  var labelXML = '<?xml version="1.0" encoding="utf-8"?><DieCutLabel Version="8.0" Units="twips"><PaperOrientation>Landscape</PaperOrientation><Id>Address</Id><PaperName>30252 Address</PaperName><DrawCommands><RoundRectangle X="0" Y="0" Width="1581" Height="5040" Rx="270" Ry="270"/></DrawCommands><ObjectInfo><TextObject><Name>TEXT</Name><ForeColor Alpha="255" Red="0" Green="0" Blue="0"/><BackColor Alpha="0" Red="255" Green="255" Blue="255"/><LinkedObjectName></LinkedObjectName><Rotation>Rotation0</Rotation><IsMirrored>False</IsMirrored><IsVariable>False</IsVariable><HorizontalAlignment>Left</HorizontalAlignment><VerticalAlignment>Top</VerticalAlignment><TextFitMode>ShrinkToFit</TextFitMode><UseFullFontHeight>True</UseFullFontHeight><Verticalized>False</Verticalized><StyledText/></TextObject><Bounds X="330" Y="58.00006" Width="4623" Height="1440"/></ObjectInfo></DieCutLabel>'

  function pushText(text, value, separator) {
    if (value && value.length > 0) {
      text.push($.trim(value));
      if (separator) {
        text.push(separator);
      }
    }
    return text;
  
  }
  
  function toText(contents, onlyText) {
    var value = [];
    contents.each(function(index, node) {
      switch(node.nodeType) {
        case 3:
          value.push($.trim(node.nodeValue));
          break;
        case 1:
          value.push(node.tagName === "BR" ? "\n" : (onlyText ? "" : $(node).text()));
          break;
      }
    });
    return value.join("");
  }

  function printLabel(address) {
    var label = null
      ,  printers = dymo.label.framework.getPrinters()
      ,  printerName = null;
        
    
    for (var i = 0; i < printers.length; ++i) {
      var printer = printers[i];
      if (printer.printerType == "LabelWriterPrinter") {
        printerName = printer.name;
        break;
      }
    }

    if (printerName === null) {
      alert("No DYMO Printers are connected to this computer.");
    } else {
      label = dymo.label.framework.openLabelXml(labelXML),
      label.setObjectText("TEXT", address);
      label.print(printerName);
    }
  }

  // Return the fields for the given address DOM element container as an array of strings
  function extractAddressFields(address) {
    if(address.closest('form')[0]) { // Address is nested inside form, address fields are form inputs
      return extractAddressFieldsFromForm(address);
    }
    if($('address', address)[0]) { // Address is nested inside form, address fields are form inputs
      return extractAddressFieldsFromAddressElement(address);
    }
    else { 
      return extractAddressFieldsFromText(address);
    }
  }

  function extractAddressFieldsFromForm(address) {
    var textParts = [];
    textParts = pushText(textParts, toText(extractAddressRecipient(), true), "\n");
    textParts = pushText(textParts, $(".street input", address).map(function(index, input){ return input.value }).toArray().join("\n"), "\n");
    textParts = pushText(textParts, $(".city input", address).val(), ", ");
    var stateSelect = $(".state select", address)[0];
    textParts = pushText(textParts, stateSelect.options[stateSelect.selectedIndex].text, " ");
    textParts = pushText(textParts, $(".zip input", address).val());
    return textParts;
  }

  function extractAddressFieldsFromText(address) {
    var textParts = [];
    textParts = pushText(textParts, toText(extractAddressRecipient(), true), "\n");
    textParts = pushText(textParts, toText($(".street .value", address).contents()), "\n");
    textParts = pushText(textParts, $(".city .value", address).text(), ", ");
    textParts = pushText(textParts, $(".state .value", address).text(), " ");
    textParts = pushText(textParts, $(".zip .value", address).text());
    return textParts;
  }

  function extractAddressFieldsFromAddressElement(address) {
    var textParts = [];
    textParts = pushText(textParts, toText(extractAddressRecipient(), true), "\n");
    textParts = pushText(textParts, toText($("address", address).contents()));
    return textParts;
  }

  function extractAddressRecipient() {
    return $(".content-sections-head").contents();
  }
  
  $(document.body).delegate(".address-print", "click", function() {
    var address = $(this).closest(".address");
    var textParts = extractAddressFields(address);
    
    try {
      printLabel(textParts.join(""));
    } catch(e) {
      if (confirm("The latest DYMO printer drivers are needed to print labels. Would you like to download them now?")) {
      	if (navigator.appVersion.indexOf("Win")!=-1) {
      	  window.location = "http://download.dymo.com/download%20drivers/Software%20for%20DYMO%20LabelWriter/Downloads/1/DLS8Setup.8.3.0.1235.exe";
      	} else if (navigator.appVersion.indexOf("Mac")!=-1) {
          window.location = "http://download.dymo.com/download%20drivers/Software%20for%20DYMO%20LabelWriter/Downloads/1/DLS8Setup.8.3.0.1410.dmg"
        } else {
          alert("Your operating system is not supported at this time.");
        }
      }
    }
  });
  
});