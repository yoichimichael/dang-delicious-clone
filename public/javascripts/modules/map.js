import axios from 'axios';
import { $ } from './bling';

const mapOptions = {
  center: { lat: 43.2, lng: -79.8 },
  zoom: 10
}

function loadPlaces(map, lat = 43.2, lng = -79.8) {
  axios.get(`/api/stores/near?lat=${lat}&lng=${lng}`)
    .then(res => {
      const places = res.data;
      if (!places.length) {
        alert('no places found!');
        return;
      }

      const markers = places.map(place => {
        // ES6 destructuring
        const [placeLng, placeLat] = place.location.coordinates;
        const position = { lat: placeLat, lng: placeLng };
        const marker = new google.maps.Marker({ map, position }); 
        marker.place = place;
        return marker; 
      });
    });
}

function makeMap(mapDiv) {
  // needs to be a mapdiv to run
  if (!mapDiv) return;
  // make our map
  const map = new google.maps.Map(mapDiv, mapOptions);
  loadPlaces(map);

  const input = $('[name="geolocate"]');
  console.log(input);
  const autocomplete = new google.maps.places.Autocomplete(input);
}


export default makeMap;