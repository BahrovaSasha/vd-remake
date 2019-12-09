$(window).on('load', function() {
    $('.preloader').delay(1000).fadeOut('fast');
});
$(document).ready(function(){



    $('.burger-menu').click(function(){
        $('.main-header').toggleClass('open-menu');
        $('body').toggleClass('fixed');
        $('.menu-open-items').toggleClass('active');
        /*$('.menu-item').on('click', function(){
            $('.menu-open-items').removeClass('active');
            $('.main-header').addClass('active').removeClass('open-menu');
            $('body').removeClass('fixed');
        });*/
    });



   /* $('.logo-wrap').click(function(){
        $('body,html').animate({
            scrollTop: $('.main-section').offset().top - 100
        }, 800);
        $('body').addClass('fixed');
    });*/



});