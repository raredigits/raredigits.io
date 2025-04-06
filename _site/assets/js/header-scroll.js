$('document').ready(function(){
  var shrinkHeader = 40;
   $(window).scroll(function() {
     var scroll = getCurrentScroll();
       if ( scroll >= shrinkHeader ) {
            $('.header-wrapper').addClass('border-bottom');
         }
         else {
             $('.header-wrapper').removeClass('border-bottom');
         }
   });
 function getCurrentScroll() {
     return window.pageYOffset;
     }
});