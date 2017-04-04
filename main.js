// Dependencies
var L = require('leaflet')
var proj4 = require('proj4')
var proj4L = require('proj4leaflet')

// Define the projection (LV95)
var lv95 = {
	epsg: 'EPSG:2056',
	def: '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs',
	resolutions: [ 4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000, 750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5],
	origin: [2420000, 1350000]
}

// Define CRS
var crs = new L.Proj.CRS(lv95.epsg, lv95.def, { 
	resolutions: lv95.resolutions, 
	origin: lv95.origin
})

// Initialze the map with options:
// * "crs" as defined above
// * "maxZoom" as the number of resolutions in the projection
var map = L.map('map', { 
	crs: crs,
	maxZoom: lv95.resolutions.length
})

// Center on Basel
map.setView([47.56,7.59], 22)

// Add a WMS layer from http://geo.bs.ch

var wms = L.tileLayer.wms('https://wms.geo.bs.ch/wmsBS?', {
		layers: 'BS.HP.Historische_Stadtplaene.Stadtplan_1946',
		maxZoom: lv95.resolutions.length,
		attribution: '<a href="http://geo.bs.ch">Kanton Basel-Stadt</a>'
	}).addTo(map)

// Add GeoJSON data
var geojson = require('./data/churches.json')

// Make sure CRS is defined
geojson.crs = {
	type: 'name',
	properties: { name: 'urn:ogc:def:crs:EPSG::2056' }
}

// Add layer
L.Proj.geoJson(geojson, {
	pointToLayer: function(feature, latlng) {
		var popup = '<b>' + feature.properties.NAME + '</b><br/>' 
			+ '<small>' + feature.properties.SUBKATEGOR + '</small>' // Define popup 
		return L.marker(latlng).bindPopup(popup) // Represent as marker
  }
}).addTo(map)



