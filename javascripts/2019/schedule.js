$(document).ready(function() {
  // TODO: if the current day matches on date-nav day, select that by default
  var date = new Date;
      year = date.getFullYear();
      month = date.getMonth();
      day = date.getDate();
      hour = date.getHours();
      dateString = year + month + day + hour;

  switch(true) {
    case dateString < 2019110106:
    displaySelectedDay('#day-one')
    break;
    case dateString < 2019110206:
    displaySelectedDay('#day-two')
    break;
    case dateString < 2019110306:
    displaySelectedDay('#day-three')
    break;
    case dateString < 2019110406:
    displaySelectedDay('#day-four')
    break;
    default:
    displaySelectedDay('#day-one')
  }


  $('.day-schedule').children('.event').each(function(i, element){
    calcuateEventLength(element);
    styleUniversalEvents(element);
    disableLinksToStaticEvents(element);
  });

  $('#schedule-2019-wrap #schedule-date-nav li').on('click', function(){
    var selected = '#' + $(this).attr('id');
    displaySelectedDay(selected);
  });
});

function displaySelectedDay(day) {
  var schedule = $('#schedule-2019-wrap #schedule');

  console.log(day)
  //// this is nothing
  $(day).parent().children().removeClass('selected');

  // hide all events (clean slate)
  schedule.children().addClass('hidden');

  //// this is something
  $(day).addClass('selected');

  // show all events on the given date
  schedule.find(day).removeClass('hidden');
}

function calcuateEventLength(e) {
  var duration = $(e).data('duration');
      span = duration / 30;
      gridStart = 'time-'+$(e).data('starttime').split(':').join('');
      gridEnd = 'span '+span;

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
