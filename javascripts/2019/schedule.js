$(document).ready(function() {
  // TODO: if the current day matches on date-nav day, select that by default

  $('.day-schedule').children('.event').each(function(){
    calcuateEventLength(this);
    styleUniversalEvents(this);
    disableLinksToStaticEvents(this);
  });

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

calcuateEventLength = function(e) {
  var duration = $(e).data('duration');
      span = duration / 30;

  $(e).css('grid-row', 'span '+span);
};

styleUniversalEvents = function(e) {
  if(e.dataset.universal == 'true'){
    $(e).css('grid-column', 'span 2');
  }
};

disableLinksToStaticEvents = function(e) {
  if(e.href.endsWith('lineup/')) {
    $(e).attr('href', null);
    $(e).css('cursor', 'unset');
  }
};
