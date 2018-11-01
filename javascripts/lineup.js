$(document).ready(function() {
  setMetadata();
});

requestedSpeaker = function() {
  // get the speaker name from the anchor tag
  var anchorTag = window.location.hash.substring(1);
  var selected = events.find(object => object.searchString === anchorTag);

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

setMetadata = function() {
  if(requestedSpeaker() === null){
    var titleOption = "Lineup 2018";
        imageOption = "";
        descriptionOption = "Information about the speakers featured this year at OCCULTURE Esoteric Conference in Berlin";
  } else {
    var titleOption = requestedSpeaker().name;
        imageOption = "https://www.occultureberlin.org/"+requestedSpeaker().avatarPath;
        descriptionOption = "Information on '"+requestedSpeaker().title+"' by "+requestedSpeaker().name+" at OCCULTURE Berlin";
  }

  var values = {
    "url": document.location.href,
    "title": "OCCULTURE Berlin | "+titleOption,
    "description": descriptionOption,
    "image": imageOption
  }

  document.title = values.title;
  $('meta[name=description]').attr('content', values.description);
  $("meta[property='og:url']").attr('content', values.url);
  $("meta[property='og:title']").attr('content', values.title);
  $("meta[property='og:description']").attr('content', values.description);
  $("meta[property='og:image']").attr('content', values.image);
}

// NOTE: this overwrites the 'loadSpeakers()' function in main.js
// allow speakers to be selected and shown individually based on anchor tag
loadSpeakers = function() {
  $.get("./partials/speakers.html", function(template) {
    var speakers = collectSpeakers();

    var speakerData = speakers.map(function(event){
      return Mustache.to_html(template, event)
    })

    $("#lineup-wrap #lineup").html(speakerData);
  }, "html");
}

// NB: the 'events' variable is set in data/events.js
collectSpeakers = function(){
  // if no speaker name is given, return all events in (mostly) random order
  // stackoverflow.com/a/38571132/2128691
  if(requestedSpeaker() === null) {
    var shuffled = events.sort(() => .5 - Math.random());
    return shuffled
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

