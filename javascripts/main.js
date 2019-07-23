$(document).ready(function() {
  // log the screen width on resize
  window.onresize = function(event) {
    console.log("window width: "+$(window).width()+"px");
  };

  // TODO: this should go into it's own file
  $('#image-carousel #images > li').toggle();
  $('#image-carousel #images > li:last').toggle().addClass("last-img").
    prev().toggle().addClass('active-img').
    prev().toggle().addClass('first-img')

  setInterval(function() {
    $('#image-carousel #images > li:last').removeClass("last-img").toggle();
    $('#image-carousel #images').prepend($('#image-carousel #images > li:last'))

    $('#image-carousel #images > li:last').
      removeClass('active-img').addClass("last-img").
      prev().removeClass('first-img').addClass('active-img').
      prev().toggle().addClass('first-img')
  },  3000);

  // landing page
  // displayLandingPage();

  // mailing list
  displayMailingList();

  // nav switching
  $(".tab-button").on("click", function(){
    var selected = $(this).attr('id').replace('-button', '');

    // remove initially visible elements
    $("#main-ticket-button").hide();
    // don't hide the high priority information for now
    //$("#high-priority-information-wrap").hide();

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

document.addEventListener('unii:opened', function(event) {
  gtag('event', 'view_item', {'items': 'get-tickets'});
}, false);

rootPath = function() {
  return window.location.protocol + '//' + window.location.host
}

// load all events
loadSpeakers = function() {
  // should be "member-of-the-lineup" i guess...?
  $.get("./partials/speakers.html", function(template) {
    var types = ['lecture', 'workshop', 'ritual', 'techgnosis', 'art']
    for( var i in types ) {
      var type = types[i];
      var collection = events.filter(object => object.type === type);
      var speakerData = collection.map(function(event){
        return Mustache.to_html(template, event)
      })

      $("#lineup-wrap #"+type).html(speakerData);
    }
  }, "html");
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
