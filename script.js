const GOOGLE_API_KEY = window.prompt("Set your API key\n(Please allow Map Tiles and Geocoding API)","")
const HOST_URL = "https://gojiteji.github.io/"



const TILESET_URL = `https://tile.googleapis.com/v1/3dtiles/root.json`;
const BUILDINGS_URL = 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/google-3d-tiles/buildings.geojson'
const creditsElement = document.getElementById('credits');

Address = window.prompt("Where do you wanna Xfy?","Twitter HQ, San Francisco, CA, USA")


var xhr = new XMLHttpRequest();
var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + Address + "&key=" + GOOGLE_API_KEY
xhr.open("GET", url, true);

// fix sending problem
//set object
xhr.onreadystatechange = function () {
  var json = JSON.parse(xhr.responseText);
  if (json.status === "OK") {
    console.log("scucessfully Xfy!")
    var lat = json.results[0].geometry.location.lat;
    var lng = json.results[0].geometry.location.lng;
    console.log(lat,lng)
    const deckgl = new deck.DeckGL({
      container: 'map',
      initialViewState: {
        latitude: lat,
        longitude: lng,
        zoom: 20,
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
  }
  else if(json.status === "ZERO_RESULTS"){
    alert("couldn't find the address!")
    setTimeout('location.reload()', 5000);
    }else{
    alert("failed to Xfy!")
    setTimeout('location.reload()', 5000);

  }
};

xhr.send();