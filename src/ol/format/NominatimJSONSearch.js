/**
 * @module ol/format/NominatimJSONSearch
 */

import {assign} from '../obj.js';
import {inherits} from '../index.js';
import {transformWithOptions} from '../format/Feature.js';
import Feature from '../Feature.js';
import JSONFeature from '../format/JSONFeature.js';
import GeoJSON from '../format/GeoJSON.js';
import Point from '../geom/Point.js';
import {get as getProjection} from '../proj.js';


/**
 * @typedef {Object} Options
 * @property {module:ol/proj~ProjectionLike} [defaultDataProjection='EPSG:4326'] Default data projection.
 * @property {module:ol/proj~ProjectionLike} [featureProjection] Projection for features read or
 * written by the format.  Options passed to read or write methods will take precedence.
 */


/**
 * @classdesc
 * Feature format to read Nominatim JSON Search results.
 *
 * @constructor
 * @extends {module:ol/format/JSONFeature}
 * @param {module:ol/format/NominatimJSONSearch~Options=} opt_options Options.
 * @api
 */

const NominatimJSONSearch = function(opt_options={}) {

  JSONFeature.call(this);

  /**
   * @inheritDoc
   */
  this.defaultDataProjection = getProjection('EPSG:4326');


  if (opt_options.featureProjection) {
    this.defaultFeatureProjection = getProjection(opt_options.featureProjection);
  }

  this.geoJsonFormat = new GeoJSON({
    defaultDataProjection: this.defaultDataProjection,
    featureProjection: this.defaultFeatureProjection
  });

};

inherits(NominatimJSONSearch, JSONFeature);


NominatimJSONSearch.prototype.readFeatureFromObject = function(object, opt_options) {
  const point = new Point([parseFloat(object.lon), parseFloat(object.lat)]);
  const properties = assign({}, object, {
    center: transformWithOptions(point, false, opt_options)
  });
  const feature = new Feature(properties);
  feature.setId(`${object.osm_type}-${object.osm_id}`);

  if (properties.geojson) {
    feature.setGeometry(this.geoJsonFormat.readGeometry(object.geojson, opt_options));
  } else {
    feature.setGeometryName("center");
  }

  return feature;
}


NominatimJSONSearch.prototype.readFeaturesFromObject = function(object, opt_options) {
  console.log(opt_options);
  const features = object.map(x => this.readFeatureFromObject(x, opt_options));
  return features;
};


NominatimJSONSearch.prototype.readProjectionFromObject = function(source) {
  return this.defaultDataProjection;
}

export default NominatimJSONSearch;
