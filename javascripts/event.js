$(document).ready(function() {
});

loadDefaultAvatar = function(image) {
  image.onError = '';
  image.src = 'https://www.occultureberlin.org/images/speakers/unknown.png';
  return true;
}
