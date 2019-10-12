$(document).ready(function() {
  countdown.DEFAULTS = countdown.DAYS

  // set countdown
  displayCountdown();

  $('#ticket-info-section-wrap .ticket .name').prepend('+ ');

  $('#ticket-info-section-wrap .ticket .name').on('click', function(){
    var details = $(this).parent().find('.details');

    details.toggleClass('hidden');
    if ( details.hasClass('hidden') ) {
      $(this).text( $(this).text().replace('-', '+') );
    } else {
      $(this).text( $(this).text().replace('+', '-') );
    };
  });
});

displayCountdown = function() {
  var time = countdown(null, new Date(2019, 9, 31), countdown.DEFAULTS).toString();
      result = "Just "+time+" left!"

  $('#countdown-wrap #countdown').html(result);
}
