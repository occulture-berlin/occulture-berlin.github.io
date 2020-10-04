$(document).ready(function() {

  $('section#past-events .nav li, section#upcoming-events .nav li').on('click', function(){
    var selected = $(this).text();
    var events = $(this).closest('section');

    //// this is nothing
    $(this).parent().children().removeClass('selected');

    // hide all events (clean slate)
    events.find('.event-wrapper').addClass('hidden')

    //// this is something
    $(this).addClass('selected');

    // show information about selected event
    events.find('.information-'+ selected).removeClass('hidden');
  });

});

// cheap hack
function toggleEvents2021(el) {
  var selected = el.closest('.upcoming-event-wrapper');

  console.log(selected)

  selected.classList.add('hidden');
  $(selected).siblings('.upcoming-event-wrapper').removeClass('hidden');
}
