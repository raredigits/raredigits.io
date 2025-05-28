$('document').ready(function(){
  var shrinkHeader = 40;
   $(window).scroll(function() {
     var scroll = getCurrentScroll();
       if ( scroll >= shrinkHeader ) {
            $('.header-container').addClass('border-bottom');
         }
         else {
             $('.header-container').removeClass('border-bottom');
         }
   });
 function getCurrentScroll() {
     return window.pageYOffset;
     }
});