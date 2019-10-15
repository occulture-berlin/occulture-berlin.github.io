$(document).ready(function() {
  // TODO: if the current day matches on date-nav day, select that by default

  $('.day-schedule').children('.event').each(function(i, element){
    calcuateEventLength(element);
    styleUniversalEvents(element);
    disableLinksToStaticEvents(element);
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

function calcuateEventLength(e) {
  var duration = $(e).data('duration');
      span = duration / 30;
      gridStart = 'time-'+$(e).data('starttime').split(':').join('');
      gridEnd = 'span '+span;

  console.log(gridStart);
  $(e).css('grid-row-start', gridStart);
  $(e).css('grid-row-end', gridEnd);
};

function styleUniversalEvents(e) {
  if(e.dataset.universal == 'true'){
    $(e).css('grid-column', 'span 2');
  }
};

function disableLinksToStaticEvents(e) {
  if(e.href.endsWith('lineup/')) {
    $(e).attr('href', null);
    $(e).css('cursor', 'unset');
  }
};

function unique(array) {
  return $.grep(array, function(el, index) {
    return index === $.inArray(el, array);
  });
}
