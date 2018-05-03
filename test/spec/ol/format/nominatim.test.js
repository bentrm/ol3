import Feature from '../../../../src/ol/Feature.js';
import NominatimJSONSearch from '../../../../src/ol/format/NominatimJSONSearch.js';
import Point from '../../../../src/ol/geom/Point.js';
import Polygon from '../../../../src/ol/geom/Polygon.js';

describe('ol.format.NominatimJSONSearch', function() {

  let format;
  beforeEach(function() {
    format = new NominatimJSONSearch()
  });

  it('parses results.json', function(done) {
    afterLoadText('spec/ol/format/nominatim/results.json', function(text) {
      const result = format.readFeatures(text);
      expect(result.length).to.be(4);

      const first = result[0];
      expect(first).to.be.a(Feature);
      expect(first.getId()).to.be("way-276464918");
      const firstGeom = first.getGeometry();
      expect(firstGeom).to.be.a(Point);
      expect(firstGeom.getCoordinates()).to.eql([52.527955, 13.7552140054313]);
      expect(first.get("importance")).to.be(.3375)

      done();
    });
  });

  it('parses results-polygon_geojson.json', function(done) {
    afterLoadText('spec/ol/format/nominatim/results-polygon_geojson.json', function(text) {
      const result = format.readFeatures(text);
      expect(result.length).to.be(4);

      const first = result[0];
      expect(first).to.be.a(Feature);
      expect(first.getId()).to.be("way-276464918");
      const firstGeom = first.getGeometry();
      expect(firstGeom).to.be.a(Polygon);
      expect(firstGeom.getFirstCoordinate()).to.eql([13.7548084, 52.5274951]);
      expect(firstGeom.getLastCoordinate()).to.eql([13.7548084, 52.5274951]);
      expect(first.get("importance")).to.be(.3375)

      done();
    });
  });

});
