const axios = require('axios');

function searchResultsHTML(stores) {
  return stores.map(store => {
    return `
      <a href="/store/${store.slug}" class="search__result">
        <strong>${store.name}</strong>
      </a>  
    `;
  }).join('')
}

function typeAhead(search){
  if (!search) return;

  const searchInput = search.querySelector('input[name="search"]');
  const searchResults = search.querySelector('.search__results');
  
  // '.on' is from bling.js 
  searchInput.on('input', function() {
    // if there is no value, quit it
    if (!this.value) {
      searchResults.style.display = 'none';    
      return; // stop!
    }

    // show search results
    searchResults.style.display = 'block';
    // remove search results
    searchResults.innerHTML = '';

    axios
      .get(`/api/search?q=${this.value}`)
      .then(res => {
        if (res.data.length) {
          console.log('There is something to show!');
          searchResults.innerHTML = searchResultsHTML(res.data);
        }
      })
      .catch(err => {
        console.error(err);
      });
  });
}

export default typeAhead;