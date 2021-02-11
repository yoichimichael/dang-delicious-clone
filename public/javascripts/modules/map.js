import axios from 'axios';
import { $ } from './bling';

const mapOptions = {
  center: { lat: 43.2, lng: -79.8 },
  zoom: 10
}

function loadPlaces(map, lat = 43.2, lng = -79.8) {

}

function makeMap(mapDiv) {
  // needs to be a mapdiv to run
  if (!mapDiv) return;
  // make our map
  const map = new google.maps.Map(mapDiv, mapOptions);
  const inptut
}


export default makeMap;