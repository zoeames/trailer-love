/* global google */

(function(){
  'use strict';
  var map;
  $(document).ready(function(){
    initMap(36.2, -85.7, 7);
    var positions = getPositions();
    positions.forEach(function(pos){
      addMarker(pos.lat, pos.lng, pos.name);
    });
  });

  function getPositions(){
    var positions = $('table tbody tr').toArray().map(function(tr){
      var name = $(tr).attr('data-loc'),
          lat  = $(tr).attr('data-lat'),
          lng  = $(tr).attr('data-lng'),
          pos  = {name:name, lat:parseFloat(lat), lng:parseFloat(lng)};
      return pos;
    });
    return positions;
  }
  function initMap(lat, lng, zoom){
    var styles = [{'featureType':'administrative','stylers':[{'visibility':'off'}]},{'featureType':'poi','stylers':[{'visibility':'simplified'}]},{'featureType':'road','elementType':'labels','stylers':[{'visibility':'simplified'}]},{'featureType':'water','stylers':[{'visibility':'simplified'}]},{'featureType':'transit','stylers':[{'visibility':'simplified'}]},{'featureType':'landscape','stylers':[{'visibility':'simplified'}]},{'featureType':'road.highway','stylers':[{'visibility':'off'}]},{'featureType':'road.local','stylers':[{'visibility':'on'}]},{'featureType':'road.highway','elementType':'geometry','stylers':[{'visibility':'on'}]},{'featureType':'water','stylers':[{'color':'#84afa3'},{'lightness':52}]},{'stylers':[{'saturation':-17},{'gamma':0.36}]},{'featureType':'transit.line','elementType':'geometry','stylers':[{'color':'#3f518c'}]}],
    mapOptions = {center: new google.maps.LatLng(lat, lng), zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP, styles:styles};
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }
  function addMarker(lat, lng, name){
    var latLng = new google.maps.LatLng(lat, lng);
    new google.maps.Marker({map: map, position: latLng, title: name, animation: google.maps.Animation.DROP, icon: '/img/caravan-128.png'});
  }
})();
