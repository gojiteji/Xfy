const GOOGLE_API_KEY = window.prompt("Set your API key\n(Please allow Map Tiles and Geocoding API)","")




const TILESET_URL = `https://tile.googleapis.com/v1/3dtiles/root.json`;
const BUILDINGS_URL = 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/google-3d-tiles/buildings.geojson'

Address = window.prompt("Where do you wanna Xfy?","Twitter HQ, San Francisco, CA")

var xhr = new XMLHttpRequest();
var url = "https://maps.googleapis.com/maps/api/geocode/json?components=" + Address + "&key=" + GOOGLE_API_KEY
xhr.open("GET", url, true);
xhr.setRequestHeader("Origin", HOST_URL);
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
    }else{
        alert("failed to Xfy!")
        console.log(url)
    }
};
xhr.send();


const creditsElement = document.getElementById('credits');
const deckgl = new deck.DeckGL({
  container: 'map',
  initialViewState: {
    latitude: 50.0890,
    longitude: 14.4196,
    zoom: 32,
    bearing: 90,
    pitch: 60,
    height: 200
  },
  controller: true,
  layers: [
    new deck.Tile3DLayer({
      id: 'google-3d-tiles',
      data: TILESET_URL,
      loadOptions: {
       fetch: {
         headers: {
           'X-GOOG-API-KEY': GOOGLE_API_KEY
         }
       }
     },
     onTilesetLoad: tileset3d => {
        tileset3d.options.onTraversalComplete = selectedTiles => {
          const credits = new Set();
          selectedTiles.forEach(tile => {
            const {copyright} = tile.content.gltf.asset;
            copyright.split(';').forEach(credits.add, credits);
            creditsElement.innerHTML = [...credits].join('; ');
          });
          return selectedTiles;
        }
      },
      operation: 'terrain+draw'
    })
  ]
});