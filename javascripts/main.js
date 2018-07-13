$(document).ready(function() {
  $(".tab-button").on("click", function(){
    var selected = $(this).attr('id').replace('-button', '');

    // clear 'selected' and designate the currently selected tab-button
    $("#nav>li.selected").removeClass("selected");
    $(this).addClass("selected");

    // hide all tabs and show the selected tab
    $(".tab").hide();
    $("#"+selected).show();
  });
});
