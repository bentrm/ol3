import Map from '../src/ol/Map.js';
import View from '../src/ol/View.js';
import {Style, Circle, Fill, Stroke, Text} from '../src/ol/style';
import {Tile as TileLayer, Vector as VectorLayer} from '../src/ol/layer.js';
import {OSM, Vector as VectorSource} from '../src/ol/source.js';
import NominatimJSONSearch from '../src/ol/format/NominatimJSONSearch';

const startButton = document.getElementById('search');
const queryInput = document.getElementById('q');
const label = document.getElementById('result-count');

const fill = new Fill({
  color: 'rgba(255,255,255,0.75)'
});
const stroke = new Stroke({
  color: '#3399CC',
  width: 1.25
});
const vectorSource = new VectorSource({
  attributions: "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright"
});
const vectorLayer = new VectorLayer({
  source: vectorSource,
  style: (feature, resolution) => {
    const importance = feature.get("importance");
    const props = {
     image: new Circle({
       fill: fill,
       stroke: stroke,
       radius: 100 * feature.get("importance")
     }),
     fill: fill,
     stroke: stroke
   };

   if (resolution < 3000) {
    return new Style(Object.assign({}, props, {
      text: new Text({
        font: `16px sans-serif`,
        text: feature.get("display_name"),
        textAlign: "left",
        backgroundFill: fill
      })
    }));
   }
   return new Style(props);
  }
});
const map = new Map({
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    vectorLayer
  ],
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});

function search() {
  const value = queryInput.value;
  if (value) {
    fetch('https://nominatim.openstreetmap.org/?format=json&limit=5&q=' + value)
    .then(response => response.json())
    .then(readResults)
    .then(throttleSearch);
  }
}

function readResults(json) {
  const features = new NominatimJSONSearch().readFeatures(json, {featureProjection: 'EPSG:3857'});
  label.innerHTML = `${features.length} results`;
  vectorSource.clear();
  vectorSource.addFeatures(features);
  map.getView().fit(vectorSource.getExtent(), {
    padding: [5, 5, 5, 5],
    maxZoom: 6
  });
}

function throttleSearch() {
  let counter = 5;
  updateButton(counter);
  const timer = setInterval(() => updateButton(--counter), 1000);
  setTimeout(() => {
    updateButton();
    clearInterval(timer);
  }, 5000);
}

function updateButton(counter) {
  if (counter) {
    startButton.disabled = true;
    startButton.innerHTML = `Search (${counter})`;
  } else {
    startButton.disabled = false;
    startButton.innerHTML = "Search";
  }
}

startButton.addEventListener('click', search, false);
