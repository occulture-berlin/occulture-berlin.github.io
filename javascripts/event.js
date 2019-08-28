$(document).ready(function() {
});

loadDefaultAvatar = function(image) {
  image.onError = '';
  image.src = '../../images/speakers/unknown.png';
  return true;
}
