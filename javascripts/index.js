$(document).ready(function() {

  $('section#past-events .nav li').on('click', function(){
    var selected = $(this).text();

    //// this is nothing
    $(this).parent().children().removeClass('selected');

    // hide all events (clean slate)
    $('section#past-events .past-event-wrapper').addClass('hidden');

    //// this is something
    $(this).addClass('selected');

    // show information about selected event
    $('section#past-events').find('#information-'+ selected).removeClass('hidden');
  });

});
