var arcticWms = OPS.Global.baseUrl.concat('/geoserver/arctic/wms');

var arcticMapPanel = Ext.create('GeoExt.panel.Map', {
	region: 'center',
	itemId: 'arcticMap',
	map: {
		allOverlays: false,
		projection: 'EPSG:3413',
		units: 'm',
		maxExtent: new OpenLayers.Bounds(-8125549,-6101879,8186727,3197247),
		controls: [
			new OpenLayers.Control.Navigation({dragPanOptions: {enableKinetic: true}}),
			new OpenLayers.Control.Zoom(),
			new OpenLayers.Control.MousePosition({prefix: '<a target="_blank" ' +'href="http://spatialreference.org/ref/epsg/3413/">' +'EPSG:3413</a>: '}),
			new OpenLayers.Control.ScaleLine()
		]
	},
	center: [110200, -1900000],
	zoom: 4,
	layers: [
		new OpenLayers.Layer.WMS("Natural Earth I",arcticWms,{layers: 'arctic:arctic_naturalearth'},{isBaseLayer:true}),
		new OpenLayers.Layer.WMS("Landsat7 Natual 90m",arcticWms,{layers: 'arctic:arctic_natural_90m'},{isBaseLayer:true}),
		new OpenLayers.Layer.WMS("Landsat7 BW 45m",arcticWms,{layers: 'arctic:greenland_bw_45m'},{isBaseLayer:true}),
		new OpenLayers.Layer.WMS("Bamber V3 Bed",arcticWms,{layers: 'arctic:greenland_bamberV3_bed'},{isBaseLayer:true}),
		new OpenLayers.Layer.WMS("2011 Joughin Velocity",arcticWms,{layers: 'arctic:greenland_joughin2011_velocity_log_magnitude'},{isBaseLayer:true}),
		new OpenLayers.Layer.WMS("Greenland Coastline",arcticWms,{layers: 'arctic:greenland_coastline',transparent:true},{isBaseLayer:true,visibility:false}),
		
		new OpenLayers.Layer.WMS('Radar Depth Sounder',arcticWms,{layers: 'arctic:arctic_rds_line_paths',transparent:true},{isBaseLayer:false,visibility:true}),
		new OpenLayers.Layer.WMS('Accumulation Radar',arcticWms,{layers: 'arctic:arctic_accum_line_paths',transparent:true},{isBaseLayer:false,visibility:false}),
		new OpenLayers.Layer.WMS('Snow Radar',arcticWms,{layers: 'arctic:arctic_snow_line_paths',transparent:true},{isBaseLayer:false,visibility:false}),
		new OpenLayers.Layer.WMS('KuBand Radar',arcticWms,{layers: 'arctic:arctic_kuband_line_paths',transparent:true},{isBaseLayer:false,visibility:false}),
		
		arcticSelectedLine = new OpenLayers.Layer.Vector('',{displayInLayerSwitcher:false})
	]
});

var toolbarItems = [];
mapHelp = Ext.create('Ext.button.Button', {
	text: 'map help',
	handler: function() {
		Ext.Ajax.request({
			url: '/app/help/maphelp.html',
			success: function(response){
				Ext.create('Ext.window.Window',{
					title: 'Map Help Documentation',
					height: 600,
					width: 600,
					layout: 'fit',
					autoScroll: true,
					closable: true,
					padding: '10 10 10 10',
					items: [{
						xtype: 'label',
						html: response.responseText
					}]
				}).show()
			}
		});
	}
});
toolbarItems.push(mapHelp);
toolbarItems.push("-");
action = Ext.create('GeoExt.Action', {
	control: new OpenLayers.Control.ZoomToMaxExtent(),
	map: arcticMapPanel.map,
	text: "max extent",
	tooltip: "zoom to the maps max extent"
});
toolbarItems.push(Ext.create('Ext.button.Button', action));
toolbarItems.push("-");
var lineMeasure = new OpenLayers.Control.DynamicMeasure(OpenLayers.Handler.Path, {maxSegments:10,immediate:true});
var areaMeasure = new OpenLayers.Control.DynamicMeasure(OpenLayers.Handler.Polygon, {maxSegments:10,immediate:true});
action = Ext.create('GeoExt.Action', {
	itemId: 'lineMeasure',
	control: lineMeasure,
	map: arcticMapPanel.map,
	text: "measure distance",
	tooltip: "draw a line to measure a distance, click the button again to clear the drawing.",
	enableToggle: true,
	toggleGroup: 'measureTools'	
});
toolbarItems.push(Ext.create('Ext.button.Button', action));
action = Ext.create('GeoExt.Action', {
	itemId: 'areaMeasure',
	control: areaMeasure,
	map: arcticMapPanel.map,
	text: "measure area",
	tooltip: "draw a polygon to measure an area, click the button again to clear the drawing.",
	enableToggle: true,
	toggleGroup: 'measureTools'
});
toolbarItems.push(Ext.create('Ext.button.Button', action));
toolbarItems.push("-");
arcticMapPanel.addDocked([{
	xtype: 'toolbar',
	dock: 'top',
	items: toolbarItems
}]);
arcticMapPanel.map.events.register(
	"click",
	arcticMapPanel.map, 
	function(clickPt) {
		
		var clickCoords = arcticMapPanel.map.getLonLatFromPixel(clickPt.xy);
		
		var selectedSystem = Ext.ComponentQuery.query('#selectedSystem')[0].value;
		var selectedSeasons = Ext.ComponentQuery.query('#selectedSeasons')[0].value;
		var startDate = Ext.ComponentQuery.query('#startDate')[0].getRawValue();
		var stopDate = Ext.ComponentQuery.query('#stopDate')[0].getRawValue();
		
		if (!selectedSystem){alert('ERROR: SELECT SYSTEM IN THE MENU BEFORE CLICKING ON THE MAP.');return}
		if (!selectedSeasons || selectedSeasons.length==0) { selectedSeasons = "";}
		if (!startDate){startDateSeg = '00000000_00';}else{startDateSeg = startDate.concat('_00');}
		if (!stopDate){stopDateSeg = '99999999_99';}else{stopDateSeg = stopDate.concat('_99');}
		
		inputJSON = JSON.stringify({"type": "Feature", "properties": { "location": "arctic", "x": clickCoords.lon , "y": clickCoords.lat , "season": selectedSeasons, "startseg": startDateSeg, "stopseg": stopDateSeg}});	
		Ext.Ajax.request({
			type: "POST",
			url: '/ops/get/closest/frame',
			params: {app:selectedSystem,data:inputJSON},
			success: function(response){arcticRenderClosestFrame(response.responseText)},
			error: function(){alert('ERROR FINDING CLOSEST FRAME ON CLICK EVENT.');}
		});
	}
);

function arcticRenderClosestFrame(response) {
	
	arcticSelectedLine.removeAllFeatures();
	responseData = JSON.parse(response);
	if (responseData.status == 0){alert(responseData.data); return};
	frameData = JSON.parse(responseData.data);
	if (frameData.echogram_url == 'NO ECHOGRAM ONLINE'){frameData.echogram_url='/media/noEchogram.png';};
	var treePanel = Ext.ComponentQuery.query('#arcticTree')[0];
	treePanel.collapse();
	var menusPanel = Ext.ComponentQuery.query('menus')[0];
	setTimeout(function(){menusPanel.collapse();},100);
	var cArcticImageBrowserPanel = Ext.ComponentQuery.query('#arcticImageBrowserPanel')[0];
	cArcticImageBrowserPanel.removeAll();
	setTimeout(function(){
		cArcticImageBrowserPanel.expand();
		var arcticEchogramImage = Ext.create('Ext.Img', {
			id: 'arcticEchogramImage',
			src: frameData.echogram_url
		});
		cArcticImageBrowserPanel.add(arcticEchogramImage);
	},200);
	setTimeout(function(){
		var points = new Array();
		for (idx=0;idx<=frameData.X.length;idx++){
			if (!isNaN(frameData.X[idx])){
				points.push(new OpenLayers.Geometry.Point(frameData.X[idx],frameData.Y[idx]))
			}
		};
		var line = new OpenLayers.Geometry.LineString(points);
		var style = {strokeColor: '#FF0000',strokeWidth: 5};
		var linefeature = new OpenLayers.Feature.Vector(line,null,style);
		arcticSelectedLine.addFeatures([linefeature]);
		arcticSelectedLine.redraw(true);
		},400);
};

var arcticStore = Ext.create('Ext.data.TreeStore', {
	model: 'GeoExt.data.LayerTreeModel',
	root: {
		expanded: true,
		children: [
			{
				plugins: [{
					ptype: 'gx_overlaylayercontainer',
					loader: {store: arcticMapPanel.layers}
				}],
				expanded: true,
				text: 'Data Layers'
			},
			{
				plugins: [{
					ptype: 'gx_baselayercontainer',
					loader: {store: arcticMapPanel.layers}
				}],
				expanded: true,
				text: 'Reference Layers'
			}
		]
	}
});

var arcticTree = Ext.create('GeoExt.tree.Panel', {
	itemId: 'arcticTree',
	region: 'east',
	title: 'Map Layer Selection',
	width: 200,
	collapsible: true,
	autoScroll: true,
	store: arcticStore,
	rootVisible: false,
	lines: true
});

var arcticEchogramPanel = Ext.create('Ext.Panel', {
	layout: 'border',
	itemId: 'arcticImageBrowserPanel',
	defaults: {
		collapsible: true,
		bodyStyle: 'padding:0px'
	},
	region: 'west',
	title: 'Echogram Image Browser',
	collapsible: true,
	collapsed: true,
	autoScroll: true,
	resizable: true,
	width: 800
});

Ext.define('OPS.view.MapTabs.ArcticTab.ArcticTab' ,{
    
    extend: 'Ext.Panel',
	
	layout: 'border',
	defaults: {
		collapsible: false,
		bodyStyle: 'padding:0px'
	},
	
	alias: 'widget.arctictab',
    title: 'Arctic',
	
	items: [arcticEchogramPanel,arcticMapPanel,arcticTree]
});