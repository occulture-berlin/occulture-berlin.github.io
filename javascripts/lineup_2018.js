$(document).ready(function() {
});

requestedSpeaker = function() {
  // get the speaker name from the anchor tag
  var anchorTag = window.location.hash.substring(1);
  var selected = events2018.find(object => object.searchString === anchorTag);

  // return immediately if no speaker was requested
  if(anchorTag === "") { return null }

  if(selected != null) {
    return selected; // if something is found, return it
  } else {
    // return null object
    var unknownSpeakerName = anchorTag.split('-').join(' ');
    return nullSpeaker(anchorTag);
  }
}

// NOTE: this overwrites the 'loadSpeakers()' function in main.js
// allow speakers to be selected and shown individually based on anchor tag
loadSpeakers = function() {
  $.get("../partials/speakers_2018.html", function(template) {
    var speakers = collectSpeakers();

    var speakerData = speakers.map(function(event){
      return Mustache.to_html(template, event)
    })

    $("#lineup-2018-wrap #lineup").html(speakerData);
  }, "html");
}

// NB: the 'events2018' variable is set in data/events_2018.js
collectSpeakers = function(){
  // if no speaker name is given, return all non-org events
  // the following link is for randomish sorting - now not used
  // stackoverflow.com/a/38571132/2128691 (this is for random-ish sorting)
  // var shuffled = events.sort(() => .5 - Math.random());

  if(requestedSpeaker() === null) {
    var filtered = events2018.filter(function(object){
      return object.type !== 'organizational';
    });

    return filtered
  };

  return [requestedSpeaker()]; // return as a collection
}

// yeah yeah, it's ugly, i know...
nullSpeaker = function(requestedName) {
  return {
    "name": "",
    "searchString": "",
    "title": "Speaker not found!",
    "avatarPath": "images/speakers/unknown.png",
    "description": "<p>Sorry, we don't know anyone called "+requestedName+"!</p><div style='margin:2em;'><a class='button' href='"+document.location.pathname+"?ref=speaker-unknown-"+requestedName+"'>See the full lineup</a></div>"
  }
}
