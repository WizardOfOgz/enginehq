$(function() {
  var solutionListing = $(".solution-listing");
  if (solutionListing.size() < 1) {
    return;
  }
  
  var actions = $('<ul class="slide-controls"><li class="prev"><a title="Displays the image of the previous slide." href="#">Previous Slide</a></li><li class="next"><a title="Displays the image of the next slide." href="#">Next Slide</a></li></ul>').appendTo(solutionListing);      
  var slides = $(".solutions").children(),
      index = slides.index(slides.filter(".selected")),
      timer;
        
  function autopage() {
    return setTimeout(
    function() {
      page(1);
    }, 4000);
  }

  function page(delta) {
    clearTimeout(timer);
    var oldSlide = $(slides.get(index));
    oldSlide.removeClass("selected");
    index = (index + delta) % slides.length;
    oldSlide.find(".image").hide();
          
    var slide = $(slides.get(index));
    slide.addClass("selected");
    slide.find(".image").stop().hide().fadeIn("slow");
      timer = autopage();
      return false;     
    }
        
    $(".prev a", actions).click(function(e) {
      return page(-1);
    });
        
    $(".next a", actions).click(function(e) {
      return page(1);
    });
        
    timer = autopage();    
}());