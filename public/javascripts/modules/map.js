import axios from 'axios';

const mapOptions = {
  center: { lat: 43.2, lng: -79.8 },
  zoom: 2
}

function loadPlaces(map, lat = 43.2, lng = -79.8) {

}

function makeMap(mapDiv) {
  // needs to be a mapdiv to run
  if (!mapDiv) return;
  // make our map
  const map = new google.maps.Map(mapDiv, mapOptions);
   
}


export default makeMap;