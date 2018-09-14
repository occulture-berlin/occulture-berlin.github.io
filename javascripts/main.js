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

// load all speakers by default, or show a given number
loadSpeakers = function(numberOfSpeakers = abstracts.length) {
  $.get("./speakers.html", function(template) {
    // the 'abstracts' variable is set in data/abstracts.js
    var shuffled = abstracts.sort(() => .5 - Math.random());
    var selected = shuffled.slice(0,numberOfSpeakers)
    var speakerData = selected.map(function(abstract){
      return Mustache.to_html(template, abstract)
    })

    $("#lineup-wrap #lineup").html(speakerData).append(
      "<p>...and many more to come</p>"
    );
  }, "html");
}

goToPage = function(path){
  // update urls when clicking a link
  // github pages use a frameset which is fucked, that's the short version.
  top.window.location.href = path
}
