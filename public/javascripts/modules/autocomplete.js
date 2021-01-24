// ES6 not yet available on Node for this tutorial
// note that googel maps, unlike MongoDB, takes lat first, lng second
function autocomplete(input, latInput, lngInput){
  if(!input) return; // skip this function from running if there is not input on the page

  // this gives us the address dropdown autocomplete for google maps
  const dropdown = new google.maps.places.Autocomplete(input); 
  
  // 'addListener' is a googlemaps function
  dropdown.addListener('place_changed', () => {
    const place = dropdown.getPlace();

    // add the coordinates to the lat and lng
    latInput.value = place.geometry.location.lat();
    lngInput.value = place.geometry.location.lng();
    console.log(place);
  });
  // if someone hits enter on the address field, don't submit the form
  // 13 is the keycode for enter
  input.on('keydown', (e) => {
    if(e.keyCode === 13) e.preventDefault();
  })
}

// ES6 syntax?
export default autocomplete;