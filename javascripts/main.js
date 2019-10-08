$(document).ready(function() {
  // log the screen width on resize
  window.onresize = function(event) {
    console.log("window width: "+$(window).width()+"px");
  };

  // landing page
  // this also displays the mailing list when landing is closed
  displayLandingPage();

  // image carousel
  $('#image-carousel').cycle({
    delay:  1000,
    speed:  500,
  });

  //// nav switching

  // only fire this on first click (`.one` wasn't working...)
  $(".tab-button").on("click", function(e){
    // if the nav bar has already switched, don't run this code
    if ($('#nav-wrap').hasClass('top-nav-bar')) { return }

    // remove initially visible elements
    $("#high-priority-information-wrap").addClass('hidden');
    $("#image-carousel-wrap").addClass('hidden');

    // convert nav styling
    $('#nav-wrap').addClass('top-nav-bar');
    $('#nav-wrap #nav').removeClass('inner');
    $('#nav-wrap #nav li').removeClass('hidden');
    $('#nav-wrap #nav li').removeClass('button');

  });

  // on subsequent clicks
  $(".tab-button").on("click", function(){
    var selected = $(this).attr('id').replace('-button', '');

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

  // hamburger nav for smaller screens
  $('#hamburger-icon').on('click', function() {
    $('.top-nav-bar #nav').toggleClass('hamburger');

    $('#nav.hamburger li').on('click', function() {
      console.log('here');
      $('.top-nav-bar #nav').removeClass('hamburger');
    });
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
      $(this).delay(15000).fadeIn();
      // $(this).delay(700*index).fadeIn();
    });
  });
}

// hide the landing page
hideLandingPage = function() {
  $("#landing-wrap .close-button").fadeOut(300);
  // fade out the components more quickly for a slower, smooter transition
  $("#landing").fadeOut(1200);
  $("#landing-wrap").fadeOut(1000, function() {
    $("footer").show();
    displayMailingList();
  });
}

// display the mailing list sign-up form
displayMailingList = function() {
  if (Cookies.get('mailing-list-vibes') != 'sick-of-it') {
    $("#mailing-list-wrap").delay(32000).fadeIn(2000);
  } else {
    console.log("You were sick of seeing the mailing list, so it's disabled");
  };
}

submitMailingList = function() {
  // var subscriptionPath = 'https://tinyletter.com/occulture-berlin';
  // window.open(subscriptionPath, '_blank', 'scrollbars=yes,width=800,height=600');
  return true
}

hideMailingList = function() {
  $("#mailing-list-wrap").fadeOut(200);
}

closeMailingList = function() {
  Cookies.set('mailing-list-vibes', 'sick-of-it', { expires: 3 });
  $("#mailing-list-wrap").fadeOut(200);
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
