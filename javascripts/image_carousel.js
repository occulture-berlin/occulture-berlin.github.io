$(document).ready(function() {
  $('#image-carousel #images > li').toggle();
  $('#image-carousel #images > li:last').toggle().addClass("last-img").
    prev().toggle().addClass('active-img').
    prev().toggle().addClass('first-img')

  setInterval(function() {
    $('#image-carousel #images > li:last').removeClass("last-img").toggle();
    $('#image-carousel #images').prepend($('#image-carousel #images > li:last'))

    $('#image-carousel #images > li:last').
      removeClass('active-img').addClass("last-img").
      prev().removeClass('first-img').addClass('active-img').
      prev().toggle().addClass('first-img')
  },  3000);
});
