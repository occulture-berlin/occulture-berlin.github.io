$(document).ready(function() {
  // TODO: if the current day matches on date-nav day, select that by default

  calcuateEventLength();
  styleUniversalEvents();

  $('#schedule-2019-wrap #schedule-date-nav li').on('click', function(){
    var selected = '#' + $(this).attr('id');
    var schedule = $('#schedule-2019-wrap #schedule');

    //// this is nothing
    $(this).parent().children().removeClass('selected');

    // hide all events (clean slate)
    schedule.children().addClass('hidden');

    //// this is something
    $(this).addClass('selected');

    // show all events on the given date
    schedule.find(selected).removeClass('hidden');
  });
});

calcuateEventLength = function() {
  $('.day-schedule').children('.event').each(function(){
    var duration = $(this).data('duration');
        span = duration / 30;

    $(this).css('grid-row', 'span '+span);
  });
};

styleUniversalEvents = function() {
  $('.day-schedule').children('.event').each(function(){
    console.log(this)
    if(this.dataset.universal == 'true'){
      $(this).css('grid-column', 'span 2');
    }
  });
};
