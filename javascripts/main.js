$(document).ready(function() {
  // log the screen width on resize
  window.onresize = function(event) {
    console.log("window width: "+$(window).width()+"px");
  };

  // TEMPORARY! Display the landing page for black moon discount
  displayBlackMoonLandingPage();

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

// load all speaker abstracts
loadSpeakers = function() {
  $.get("./speakers.html", function(template) {
    var speakerData = abstracts.map(function(abstract){
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

displayBlackMoonLandingPage = function() {
  $("#black-moon-landing-wrap").slideDown(1200, function() {
    $("footer").hide();
    // select all steps
    $(".step").each(function(index) {
      $(this).delay(600*index).fadeIn();
    });
  });
}

hideBlackMoonLandingPage = function() {
  $("#black-moon-landing-wrap .close-button").fadeOut(300);

  // fade out the components more quickly for a slower, smooter transition
  $("#black-moon-landing").fadeOut(1200);
  $("#black-moon-landing-wrap").fadeOut(3000, function() {
    $("footer").show();
    displayMailingList();
  });
}

// display the mailing list sign-up form
displayMailingList = function() {
  $("#mailing-list-boop-boop").delay(1000).fadeIn(2000);
}

hideMailingList = function() {
  $("#mailing-list-boop-boop").fadeOut(200);
}
