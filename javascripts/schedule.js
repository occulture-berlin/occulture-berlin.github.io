$(document).ready(function() {
  //loadTimeline();
  loadEvents();
});

document.addEventListener('keyup', function (event) {
  if (event.defaultPrevented) { return; }

  var key = event.key || event.keyCode;

  if (key === 'Escape' || key === 'Esc' || key === 27) {
    hideEventModal();
  }
});

getDates = function() {
  var dates = events.map(object => object.date);
  return dates.rejectBlanks().uniq();
}

getLocations = function() {
  var locations = events.map(object => object.location);
  return locations.rejectBlanks().uniq();
}

sortByStartTime = function(events) {
  return events.sort(function(a, b){
    return parseInt(a.start.split(':').join("")) - parseInt(b.start.split(':').join(""))
  })
}

getCalculatedHeight = function(event) {
  var endTime = event.end.split(':');
  var startTime = event.start.split(':');

  var hours = parseInt(endTime[0]) - parseInt(startTime[0])
  var minutes = parseInt(endTime[1])/60 - parseInt(startTime[1])/60
  return (hours + minutes)*15 + "em";
}

loadTimeline = function() {
  var dates = getDates();
  dates.forEach(function(date) {
    var eventsOnDate = events.filter(object => object.date === date)
    var startingTimes = eventsOnDate.map(object => object.start).uniq().sort();
    var listed = startingTimes.rejectBlanks().map(function(time) {
      return "<li><span>"+time+"</span></li>"
    });

    $("#schedule-wrap #"+date+" .timeline").html("<ul>"+listed.join('')+"</ul>");
  })
}

loadEvents = function() {
  $.get("../partials/schedule/event.html", function(eventTemplate) {
    var dates = getDates();
    var locations = getLocations();

    dates.forEach(function(date) {
      var eventsOnDate = events.filter(object => object.date === date);
      var eventsByLocation = locations.map(function(location) {
        var relevantEvents = eventsOnDate.filter(object => object.location === location);
        // break loop if the location has no events on the given date
        if( relevantEvents.length === 0 ) { return };

        var sortedEvents = sortByStartTime(relevantEvents);
        var html = "<li class='events-group'>"
            html += "<div class='top-info'><span>"
            html += "<img src='../images/"+location+".png'>"+location+"</span></div>"
        var template = sortedEvents.map(function(singleEvent, index) {
          Object.assign(singleEvent, {
            calculatedHeight: getCalculatedHeight(singleEvent),
            eventIndex: index +1,
            avatarPath: rootPath() +"/"+ singleEvent.avatarPath
          });
          return Mustache.to_html(eventTemplate, singleEvent)
        });

        return html += "<ul>"+template.join('')+"</ul></li>"
      })

      $("#schedule-wrap #"+date+" .events ul").html(eventsByLocation);
      // if there's only one location with events, give it full width
      if( $("#"+date+" .events-group").length === 1) {
        $("#"+date+" .events-group").css("width", '90%');
      }
    })
  })
}

loadModal = function(searchString) {
  $.get("../partials/schedule/event-modal.html", function(eventTemplate) {
    var selected = events.find(object => object.searchString === searchString);
    var template = Mustache.to_html(eventTemplate, selected)

    $("#schedule-wrap #event-overlay").html(template).show();
  })
}

hideEventModal = function() {
  $("#schedule-wrap #event-overlay").hide();
}
