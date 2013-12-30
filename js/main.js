function main() {
  $('#overlay').css("display", "none");
  FB.api('/362342307175776', function(doc) {
    showInMap(parseMessage(doc.message));
  });
}
function parseFriend(text) {
  //Delete first <p> </p> if empty
  //Parse name
  var pattern = /<p>([^<>]*?\S[^<>]*?)<\/p>/g;
  var lines = [];
  var rawInfo = pattern.exec(text);
  while(rawInfo != null) {
    lines.push(rawInfo[1]);
    rawInfo = pattern.exec(text);
  }
  return {name: lines[0], street: lines[1], city: lines[2]};
  /*for(v in rawInfo) {
    for(f in fields) { #enumerate
    if(v.search(f) == 0) {
    use id to get key-field from other array
    infos[infoFields[i]] = v;
    }
    }
    }*/
}
/* Parse the doc and return an array with all the peops */
function parseMessage(message) {
  //Delete till first line with maximum 3 words
  // First split with
  var objects = message.split(/<p>\s*[-_]{1,}\s*<\/p>/);
  objects.shift();
  return jQuery.map(objects, parseFriend);

}
/* mark friends on map */
function showInMap(friendObject) {
  for(var i=0; i<friendObject.length; i++) {
    globalFriends = friendObject;
    globalIndex = 0;
    setTimeout(addLocation, 1000*i);
  }
}
function addLocation() {
  var address = globalFriends[globalIndex].city+","+globalFriends[globalIndex].street;
  var name = globalFriends[globalIndex].name;
  globalIndex++;

  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      //map.setCenter(results[0].geometry.location);
      var marker = new MarkerWithLabel({
        map: map,
          position: results[0].geometry.location,
          draggable: false,
          labelContent: name,
          labelClass: "nameLabel", // the CSS class for the label
          labelStyle: {'font-size':'15px', 'font-weight': '700', 'color': '#B407C3'},
          labelAnchor: new google.maps.Point(15, 5),
          labelInBackground: false
      });
    }
    else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}
function showAuthError() {
  // notify failed login
  alert('facebook login error. ask moritz');

}
function initMaps() {
  var mapOptions = {
    center: new google.maps.LatLng(50.378666,10.349609),
    zoom: 5
  };
  map = new google.maps.Map(document.getElementById("map-canvas"),
      mapOptions);
  geocoder = new google.maps.Geocoder();
}
function onLoginClick() {
      FB.login(function(response){
           if (response.authResponse) {
             main();
             } else {
              showAuthError(response);
             }
          }, {"scope": "user_groups"});
}
