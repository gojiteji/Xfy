const GOOGLE_API_KEY = window.prompt("Set your API key\n(Please allow Map Tiles and Geocoding API)", "")
const height = window.prompt("How high do you wanna bump X up to? (meter)", "22")
height = parseFloat(height);

const HOST_URL = "https://gojiteji.github.io/"



const TILESET_URL = `https://tile.googleapis.com/v1/3dtiles/root.json`;
const BUILDINGS_URL = 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/google-3d-tiles/buildings.geojson'
const creditsElement = document.getElementById('credits');

Address = window.prompt("Where do you wanna Xfy?", "Twitter HQ, San Francisco, CA, USA")


var xhr = new XMLHttpRequest();
var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + Address + "&key=" + GOOGLE_API_KEY
xhr.open("GET", url, true);

//set object
xhr.onreadystatechange = function () {
  var json = JSON.parse(xhr.responseText);
  if (json.status === "OK") {
    console.log("scucessfully Xfy!")
    var lat = json.results[0].geometry.location.lat - 0.0000018;
    var lng = json.results[0].geometry.location.lng - 0.00025;
    console.log(lat, lng)


    darkX = new deck.IconLayer({
      id: 'icon-layer',
      data: [{
        coordinates: [lng, lat, height]
      }],
      sizeUnits: 'meters',
      sizeScale: 10,

      iconAtlas: 'https://gojiteji.github.io/Xfy-Anywhere/X2.gif',
      iconMapping: ICON_MAPPING,
      getIcon: d => 'marker',
      sizeScale: 1,
      visible: true,
      getPosition: d => d.coordinates,
      getSize: d => 10,
      getColor: d => [255, 255, 255]
    })


    lightX = new deck.IconLayer({
      id: 'icon-layer',
      data: [{
        coordinates: [lng, lat, height]
      }],
      sizeUnits: 'meters',
      sizeScale: 10,

      iconAtlas: 'https://gojiteji.github.io/Xfy-Anywhere/X.gif',
      iconMapping: ICON_MAPPING,
      getIcon: d => 'marker',
      sizeScale: 1,
      visible: true,
      getPosition: d => d.coordinates,
      getSize: d => 10,
      getColor: d => [255, 255, 255]
    })


    /*
    pointLight=new deck.PointLight({
      color: [0, 255, 0],
      intensity: 1.0,
      coordinateSystem: deck.COORDINATE_SYSTEM.LNGLAT,
      position: [lng,lat,height],
      _shadow: true
    })
    */


    Tile = new deck.Tile3DLayer({
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
            const {
              copyright
            } = tile.content.gltf.asset;
            copyright.split(';').forEach(credits.add, credits);
            creditsElement.innerHTML = [...credits].join('; ');
          });
          return selectedTiles;
        }
      },
      operation: 'terrain+draw'
    })


    const deckgl = new deck.DeckGL({
      container: 'map',
      initialViewState: {
        latitude: lat,
        longitude: lng,
        zoom: 19,
        bearing: 90,
        pitch: 60,
        height: 200
      },
      controller: true,
      /*
      effects: [new deck.LightingEffect({
        pointLight
      })],
      */
      layers: [
        /*
        new deck.PointCloudLayer({
          id: 'point-lights',
          data: [pointLight],
          coordinateSystem: deck.COORDINATE_SYSTEM.LNGLAT,
          getPosition: d => d.position,
          getColor: d => d.color,
          pointSize: 5,
          material: null
        }),
        */
        Tile,
        lightX
      ]

    });

  } else if (json.status === "ZERO_RESULTS") {
    alert("couldn't find the address!")
    setTimeout('location.reload()', 5000);
  } else {
    alert("failed to Xfy!")
    setTimeout('location.reload()', 5000);

  }
};

xhr.send();