$(document).ready(function() {
  // log the screen width on resize
  window.onresize = function(event) {
    console.log("window width: "+$(window).width()+"px");
  };

  $(".tab-button").on("click", function(){
    var selected = $(this).attr('id').replace('-button', '');

    // remove initially visible elements
    $("#main-ticket-button").hide();
    $("#high-priority-information-wrap").hide();

    // clear 'selected' and designate the currently selected tab-button
    $("#nav>li.selected").removeClass("selected");
    $(".sub-nav>li.selected").removeClass("selected");
    $(this).addClass("selected");

    // hide all tabs and show the selected tab
    $(".tab").hide();
    $("#"+selected).show();

    // show sub-navigation if relevant
    if($("#"+selected).hasClass("sub-navigable")) {
      $("#"+selected+"-sub-nav").show();
    } else if($("#"+selected).hasClass("sub-tab")) {
      // re-select the parent nav button to clarify sub-nav origin
      var parentNavButton = this.parentNode.id.replace('sub-nav', 'button');
      $("#"+parentNavButton).addClass("selected");
    } else {
      $(".sub-nav").hide();
    };
  });
});

// load all speakers by default, show a given number, or load by name
loadSpeakers = function(numberOfSpeakers = abstracts.length) {
  $.get("./speakers.html", function(template) {
    var speakers = collectSpeakers(numberOfSpeakers);

    var speakerData = speakers.map(function(abstract){
      return Mustache.to_html(template, abstract)
    })

    $("#lineup-wrap #lineup").html(speakerData);
  }, "html");
}

goToPage = function(path){
  // update urls when clicking a link
  // github pages use a frameset which is fucked, that's the short version.
  top.window.location.href = path
  // send this as an event to google analytics
  gtag('event', 'page_view', {'page_path': path});
}

//// INTERNAL FUNCTIONS

// NB: the 'abstracts' variable is set in data/abstracts.js
collectSpeakers = function(numberOfSpeakers){
  // get the speaker name from the anchor tag
  var anchorTag = window.location.hash.substring(1);

  // if no speaker name is given,
  // return the requested number of speakers in random order
  if(anchorTag === "") {
    var shuffled = abstracts.sort(() => .5 - Math.random());
    return shuffled.slice(0,numberOfSpeakers)
  };

  // NOTE: important to change object.name to lowercase so the strings match
  var selected = abstracts.find(object => object.searchString === anchorTag);

  if(selected != null) {
    return [selected]; // return as a collection
  } else {
    // return null object as collection
    var speakerName = anchorTag.split('-').join(' ');
    return [{
      "name": "",
      "title": "Speaker not found!",
      "avatar-path": "",
      "abstract": "<p>Sorry, we don't know anyone called "+speakerName+"!</p>"
    }]
  }
}
