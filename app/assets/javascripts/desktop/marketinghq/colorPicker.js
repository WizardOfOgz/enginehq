(function($) {
  
  var control = null,
      spectrumControl = null,
      brightnessScreen = null,
      brightnessControl = null;
      focusedInput = null,
      trigger = null,
      color = { H : 0, S : 100, V : 100, R : 0, G : 0, B : 0 };
    
  /**
  * Updates the RGB values on the color object.
  * @param {Array} rgb The RGB values to update
  */  
  function setRGB(rgb) {
    color.R = rgb[0];
    color.G = rgb[1];
    color.B = rgb[2];
  }  
  
  /** 
  * Updates the HSV and RGB values on the color object.
  * @param {Array} hsv The HSV values to update. These values will then be converted to RGB and updated.
  */
  function setHSV(hsv) {
    color.H = hsv[0];
    color.S = hsv[1];
    color.V = hsv[2];
    setRGB(HSV2RGB(color.H/360 * 255, color.S/100 * 255, color.V/100 * 255));  
  }
  
  /**
  * Gets the RGB brightness value.
  * @param {Array} rgb The RGB values to calculate the brightness with.
  * @return {float} The brightness for the given RGB values.
  */
  function getBrightness(rgb) {
    return Math.sqrt(rgb[0] * rgb[0] * .241 + rgb[1] * rgb[1] * .691 + rgb[2] * rgb[2] * .068);
  }

  /**
  * Converts the given RGB values to their hexidecimal equivalent.
  * @param {Array} rbg The RGB value to convert to hexidecimal values.
  * @return {String} The hexidecimal representation of the given RGV values in uppercase lettering.
  */
  function RGB2HEX(rgb) {
    return [rgb[0] < 16 ? '0' : '', rgb[0].toString(16), 
      rgb[1] < 16 ? '0' : '', rgb[1].toString(16), 
      rgb[2] < 16 ? '0' : '', rgb[2].toString(16)].join("").toUpperCase();
  }
  
  /**
  * Converts the given hexidecimal color to its RGB equivalent.
  * @param {String} hex The hexidecimal color value to convert to RGB.
  * @return {Array} The RGB represetnation of the given hexidecimal value.
  */
  function HEX2RGB(hex) {
    hex = hex.replace('#','');
    return [parseInt(hex.substr(0, 2), 16), parseInt(hex.substr(2, 2), 16), parseInt(hex.substr(4, 2), 16)];
  }
  
  /**
  * Converts the given HSV values to the RGB equivalent.
  * @param {int} x The hue to convert to RGB
  * @param {int} y The saturation to convert to RGB
  * @param {int} z The value to convert to RGB
  * @return {Array} The RGB representation of the given HSV values.
  */
  function HSV2RGB(x, y, z) {
    var r = g = b = c = 0,
    d = (100 - z/255 * 100)/100,
    i = y/255,
    j = y * (255 - z)/255;
    cPHue = z;
    
    if (x < 42.5) {
      r = y;
      g = x * 6 * i;
      g += (y - g) * d;
      b = j;
    } else if (x >= 42.5 && x < 85) {
      c = 42.5;
      r = (255 - (x - c) * 6) * i;
      r += (y - r) * d;
      g = y;
      b = j;
    } else if ( x >= 85 && x < 127.5) {
      c = 85;
      r = j;
      g = y;
      b = (x - c) * 6 * i;
      b += (y - b) * d;
    } else if ( x >= 127.5 && x < 170) {
      c = 127.5;
      r = j;
      g = (255 - (x-c) * 6) * i;
      g += (y - g) * d;
      b = y;
    } else if (x >= 170 && x < 212.5) {
      c = 170;
      r = (x - c) * 6 * i;
      r += (y - r) * d;
      g = j;
      b = y;
    } else if (x>=212.5) {
      c = 212.5;
      r = y;
      g = j;
      b = (255 - (x - c) * 6) * i;
      b += (y - b) * d;
    }
    return [Math.round(r),Math.round(g),Math.round(b)];
  }
  
  function HEX2HSV(hex) {
    return RGB2HSV(HEX2RGB(hex));
  }

  /**
  * Converts the given RGV color to its HSV equivalent.
  * @param {Array} rgb The RGB color value to convert to HSV.
  * @return {Array} The HSV representation of the given RGB color values.
  */
  function RGB2HSV(rgb) {
    var r = rgb[0],
        b = rgb[1],
        g = rgb[2],
        n = Math.min(Math.min(r,g),b), 
        v = Math.max(Math.max(r,g),b),
        m = v - n,
        h;
        
    if(m === 0) {
      return [0, 0, v/255 * 100];
    }
    
    h = r === n ? 3 + (b-g)/m : (g === n ? 5 + (r - b)/m : 1 + (g - r)/m);
    return [h === 6 ? 0 : h * 60, m/v * 100, v/255 * 100];
  }

  function activate(e, input) {
    var offset = input.offset();
    
    trigger = e.target;
    
    buildControl();
    control.css({
      top : offset.top + "px",
      left : offset.left + input.outerWidth() + "px"
    });
     
    if (focusedInput && focusedInput.get(0) == input.get(0)) {
      control.toggle();
    } else {
      focusedInput = input;
      control.show();
    }
  }
  
  function buildControl() {
    control = control || $("<div class=\"color-picker\"><span class=\"header\">Select A Color</span><div class=\"spectrum\"><div class=\"brightness-screen\"></div></div><div class=\"brightness\"></div></div>").appendTo(document.body);
    spectrumControl = control.children(".spectrum").bind("click", updateColor);
    brightnessControl = control.children(".brightness").bind("click", updateBrightness);
    brightnessScreen = spectrumControl.children(".brightness-screen");
    
    $(document.body).click(function(e) {
      if (e.target !== control.get(0) && !$.contains(control.get(0), e.target) && e.target !== trigger && !$.contains(trigger, e.target)) {
        control.hide();
      }
    });
  }
  

  function updateBrightness(e) {
    var offset = brightnessControl.offset(),
        mouseY = e.pageY - offset.top;
        
    setHSV([color.H, 100-mouseY, color.V]);
    brightnessScreen.fadeTo(0, (100-color.S)/100);
    updateFocusedInput();
  }
  
  function updateFocusedInput() {
    focusedInput.val("#" + RGB2HEX([color.R, color.G, color.B])).trigger("keyup").trigger("change");
  }
  
  function updateColor(e) {
    var spectrumOffset = spectrumControl.offset(),
        mouseX = e.pageX - spectrumOffset.left, 
        mouseY = e.pageY - spectrumOffset.top,
        hvsMode = true,
        Hc, Sc, Sr, Vr;
    
    mouseY = mouseY < 0 ? 0 : mouseY > 100 ? 100 : mouseY;
    mouseX = mouseX < 0 ? 0 : mouseX > 180 ? 180 : mouseX;
    
    Hc = mouseX/180 * 255, 
    Sc = Vc = 255 - (mouseY/100 * 255), // c = coordinate whise
    Sr = color.S/100 * 255, 
    Vr = color.V/100 * 255;    // r = real
    
    setHSV([mouseX*2, color.S, 100-mouseY]);
    brightnessControl.css({backgroundColor : 'rgb('+ HSV2RGB(Hc, 255, Vc) +')'});
    updateFocusedInput();
    return false;
  }
  
  $(document).bind("colorpicker", activate);
  
  $.fn.colorInput = function() {
    return this.each(function(index, colorControl) {
      var button = $("<a class=\"action open-color-picker\" href=\"#\"><span>Open Color Picker</span></a>").insertAfter($("input", colorControl));
      $(colorControl).bind("change", function() {
        button.children().css({backgroundColor : $(colorControl).find("input").val()})
      }).trigger("change");
    });
  }
  
}(jQuery));