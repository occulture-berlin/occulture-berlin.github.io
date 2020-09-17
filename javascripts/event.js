$(document).ready(function() {
});

loadDefaultAvatar = function(image) {
  image.onError = '';
  image.src = 'https://www.occultureconference.com/images/speakers/unknown.png';
  return true;
}
