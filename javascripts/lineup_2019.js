$(document).ready(function() {
});

// load all events
loadLineup2019 = function() {
  $.get("./partials/lineup_member.html", function(template) {
    var types = ['Lecture', 'Workshop', 'Ritual', 'Techgnosis', 'Art', 'Performance']
    //for( var i in types ) {
    //var type = types[i];
    var collection = events2019.filter(object => types.includes(object.type));
    var lineupData = collection.map(function(event){
      return Mustache.to_html(template, event)
    })

    $("#lineup-2019-wrap #lineup").html(lineupData);
    //}
  }, "html");
}

