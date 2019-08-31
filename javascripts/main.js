$(document).ready(function() {
  // log the screen width on resize
  window.onresize = function(event) {
    console.log("window width: "+$(window).width()+"px");
  };

  // landing page
  displayLandingPage();

  // mailing list
  displayMailingList();

  // nav switching
  $(".tab-button").on("click", function(){
    var selected = $(this).attr('id').replace('-button', '');

    // TODO: can i just run the first blocks on first click?
    // remove initially visible elements
    $("#high-priority-information-wrap").addClass('hidden');
    $("#image-carousel").addClass('hidden');

    // convert nav styling
    $('#nav-wrap').addClass('top-nav-bar');
    $('#nav-wrap #nav').removeClass('inner');
    $('#nav-wrap #nav li').removeClass('hidden');
    $('#nav-wrap #nav li').removeClass('button');

    // clear 'selected' and designate the currently selected tab-button
    $("#nav>li.selected").removeClass("selected");
    $(".sub-nav>li.selected").removeClass("selected");
    $(this).addClass("selected");

    // hide all tabs and show the selected tab
    $(".tab").hide();
    $("#"+selected).toggle();

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

  // track clicks of any element with ga-track class
  $('.ga-track').on('click', function() {
    var name = this.getAttribute('data-tracker') || $(this).text() || this.value

    gtag('event', 'click', {
      'event_category': 'engagement',
      'event_label': 'click-'+name
    });
  });
});

rootPath = function() {
  return window.location.protocol + '//' + window.location.host
}

// NOTE: This is for internal linking only!
goToPage = function(path){
  // update urls when clicking a link
  // github pages use a frameset which is fucked, that's the short version.
  top.window.location.href = rootPath() +"/"+ path
  // send this as an event to google analytics
  gtag('event', 'page_view', {'page_path': path});
}

// display the landing page
displayLandingPage = function() {
  $("#landing-wrap").slideDown(1200, function() {
    $("footer").hide();
    // select all steps
    $(".step").each(function(index) {
      $(this).delay(700*index).fadeIn();
    });
  });
}

// hide the landing page
hideLandingPage = function() {
  $("#landing-wrap .close-button").fadeOut(300);
  // fade out the components more quickly for a slower, smooter transition
  $("#landing").fadeOut(1200);
  $("#landing-wrap").fadeOut(3000, function() {
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

// add uniq method to Array object
// stackoverflow.com/a/14438954/2128691
Array.prototype.uniq = function() {
  return this.filter(function (value, index, self) {
    return self.indexOf(value) === index;
  });
}

Array.prototype.rejectBlanks = function() {
  return this.filter(function(value) {return value.length != 0});
}
