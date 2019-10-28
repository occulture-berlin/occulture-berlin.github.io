$(document).ready(function() {
  // lazy load avatars on page ready
  lazyLoadAvatars();

  // hide the 'all' button in sub-nav by default
  $('#lineup-2019-wrap #lineup-sub-nav #all').hide();

  $('#lineup-2019-wrap #lineup-sub-nav li').on('click', function(){
    var selected = $(this).attr('id');
    var lineup = $('#lineup-2019-wrap #lineup-grid');

    //// this is nothing
    $(this).parent().children().removeClass('selected');

    // only show "all" when one of the categories is selected
    if ( selected == 'all') {
      $(this).hide();
    } else {
      $('#all').show();
    };

    // hide all events (clean slate)
    lineup.children().hide();

    //// this is something
    $(this).addClass('selected');

    // show all events for the given category
    if ( selected == 'all') {
      lineup.children().show();
    } else {
      lineup.children('.'+selected).show();
    };
  });
});

lazyLoadAvatars = function() {
  $('.avatar img').each(function(){
    var this_image = this;
    var src = $(this_image).attr('src') || '' ;
    var lsrc = $(this_image).attr('data-path') || '' ;

    this_image.src = lsrc;
  })
}

loadDefaultAvatar = function(image) {
  image.onError = '';
  image.src = 'https://www.occultureberlin.org/images/speakers/unknown.png';
  return true;
}
