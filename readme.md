# Leafet custom projection

Being a lightweight library, [LeafletJS](http://leafletjs.com/) does not support many projections out of the box. But thanks to the [proj4leaflet](http://kartena.github.io/Proj4Leaflet/) plugin we can use whatever projection we want. In this short tutorial we will create a map using the swiss projection LV95 (EPSG:2056).

## The dependencies

```
var L = require('leaflet')
var proj4 = require('proj4')
var proj4L = require('proj4leaflet')
```

## Define the projection

```
var lv95 = {
	epsg: 'EPSG:2056',
	def: '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs',
	resolutions: [ 4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000, 750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5],
	origin: [2420000, 1350000]
}
```

## Define the CRS

```
var crs = new L.Proj.CRS(lv95.epsg, lv95.def, { 
	resolutions: lv95.resolutions, 
	origin: lv95.origin
})
```

## Initialize the map

using the CRS and setting max-zoom to the number of available resolutions

```
var map = L.map('map', { 
	crs: crs,
	maxZoom: lv95.resolutions.length
})

map.setView([47.56,7.59], 22)
```

We are ready to add some layers.

## Add a WMS layer

For this example I used the WMS of [Kanton Basel-Stadt](http://geo.bs.ch/geodaten/geodienste.html).

```
var wms = L.tileLayer.wms('https://wms.geo.bs.ch/wmsBS?', {
	layers: 'BS.HP.Historische_Stadtplaene.Stadtplan_1946',
	maxZoom: lv95.resolutions.length,
	attribution: '<a href="http://geo.bs.ch">Kanton Basel-Stadt</a>'
}).addTo(map)
```

## Add a GeoJSON layer

For this layer I extracted the churches from the [POIs of Kanton Basel](http://shop.geo.bs.ch/geoshop_app/geoshop/). 

```
var geojson = require('./data/churches.json')
```

To make sure that the data is projected correctly, add define the CRS on the GeoJSON.

```
geojson.crs = {
	type: 'name',
	properties: { name: 'urn:ogc:def:crs:EPSG::2056' }
}
```

Add the layer.

```
L.Proj.geoJson(geojson, {
	pointToLayer: function(feature, latlng) {
		var popup = '<b>' + feature.properties.NAME + '</b><br/>' 
			+ '<small>' + feature.properties.SUBKATEGOR + '</small>' // Define popup 
		return L.marker(latlng).bindPopup(popup) // Represent as marker
  }
}).addTo(map)
```

That is it.

If you need to convert between swiss coordinates (LV03 and LV95) in the browser or NodeJS, check out [swiss-projection-light](https://www.npmjs.com/package/swiss-projection-light).  


