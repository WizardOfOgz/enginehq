/**
* options.width = max width of the canvas
* options.crop_width = max width to crop image to
*/
function ImageEditor(canvas, options) {
  var context = canvas.getContext("2d"),
      image = new Image(),
      canvasOffset,
      canvasWidth,
      canvasHeight,
      imageScale = 1,
      bbox = {},
      croppedCanvas = $("<canvas/>").hide().appendTo($(document.body)).get(0),
      croppedContext = croppedCanvas.getContext("2d");
  
  	    
	function drawPreview() {
	  context.restore();
	  context.drawImage(image, 0, 0, canvasWidth, canvasHeight);
	  context.save();

	  if (!bbox.x1 && !bbox.y1) {
	    return;
	  }
	      
	  context.fillStyle = "rgba(0,0,0,.7)";
	  context.fillRect(0, 0, canvasWidth, canvasHeight);
	  
    var box = getDrawingBox(),
        size = box.size;
	  context.drawImage(image, box.x/imageScale, box.y/imageScale, size/imageScale, size/imageScale, box.x, box.y, size, size);
	        
	  context.strokeStyle = "rgb(255,255,255)";
	  context.lineWidth = 2;
	  context.strokeRect(box.x, box.y, size, size);   
	}
	
	function crop() {
	  var box = getDrawingBox(),
	      size = Math.abs(box.size)/imageScale,
	      cropSize = size > options.crop_width ? options.crop_width : size;
	      
	  croppedContext.restore();
	  croppedCanvas.width = cropSize;
	  croppedCanvas.height = cropSize;
	  croppedContext.drawImage(image, box.x/imageScale, box.y/imageScale, size, size, 0, 0, cropSize, cropSize);
	  return croppedCanvas.toDataURL("image/png");
	}
	
	$(canvas).mousedown(function(e) {
	  setBbox(e.pageX, e.pageY, null, null);
	  $(document).bind("mousemove", trackMouse);
	  drawPreview();
	});
	    
	$(canvas).mouseup(function(e) {
	  $(document).unbind("mousemove", trackMouse);
	  $(canvas).trigger("preview", crop());
	});
	
	function trackMouse(e) {
    setBbox(bbox.x0, bbox.y0, e.pageX, e.pageY);
    drawPreview();
	}
	
	/**
	* Gets the bounding box to draw relative to the canvas.
	*/
	function getDrawingBox() {
	  var box = {
	      x0 : bbox.x0 - offset.left,
	      x1 : bbox.x1 - offset.left,
	      y0 : bbox.y0 - offset.top,
	      y1 : bbox.y1 - offset.top
	    },
	    x1 = box.x1 < 0 ? 0 : box.x1,
	    y1 = box.y1 < 0 ? 0 : box.y1;
	  
	  x1 = x1 > canvasWidth ? canvasWidth : x1;
	  y1 = y1 > canvasHeight ? canvasHeight : y1;
	  
	  var dx = Math.abs((box.x0 - x1)/(box.x0 - box.x1)), 
	      dy = Math.abs((box.y0 - y1)/(box.y0 - box.y1)),
	      dxy = Math.max(dx,dy);
	
	  size = Math.min(Math.abs(box.x1 - box.x0), Math.abs(box.y1 - box.y0)) * dxy;
	  
	  return {
	    x : box.x1 < box.x0 ? box.x0-size : box.x0,
	    y :  box.y1 < box.y0 ? box.y0-size : box.y0,
	    size : Math.abs(size)
	  };
	}
	
	/**
	* Sets the bounding box being drawn relative to the document.
	*/
	function setBbox(x0, y0, x1, y1) {  
	  bbox = {
	    x0 : x0,
	    y0 : y0
	  }
	  
	  if (Math.abs(x0-x1) < 10 && Math.abs(y0-y1) < 10) {
	    bbox.x1 = bbox.y1 = null;
	  } else {
	    bbox.x1 = x1;
	    bbox.y1 = y1;
	  }
	}

	
  return {
    setImageFile : function(file) {
      if (!file.type.match(/image.*/)) {
	      return;
	    }
	    
	    var reader = new FileReader();
	    image.onload = function() {
        canvasWidth = image.width;
        canvasHeight = image.height;
        
        if (canvasWidth > options.width) {
          imageScale = options.width / canvasWidth;
          canvasHeight *= imageScale;
          canvasWidth = options.width;
        }
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        offset = $(canvas).offset()
        drawPreview();
	    }
	    reader.onload = function(e) { 
	      image.src = e.target.result; 
	    };
	    reader.readAsDataURL(file);
	    
    },
    
    setImageURL : function() {
    
    }
  };
};