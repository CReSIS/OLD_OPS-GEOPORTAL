var antarcticWms = OPS.Global.baseUrl.concat('/geoserver/antarctic/wms');

var antarcticMapPanel = Ext.create('GeoExt.panel.Map', {
	region: 'center',
	itemId: 'antarcticMap',
	map: {
		allOverlays: false,
		projection: 'EPSG:3031',
		units: 'm',
		maxExtent: new OpenLayers.Bounds(-8221026,-4585257,8091116,4715069),
		controls: [
			new OpenLayers.Control.Navigation({dragPanOptions: {enableKinetic: true}}),
			new OpenLayers.Control.Zoom(),
			new OpenLayers.Control.MousePosition({prefix: '<a target="_blank" ' +'href="http://spatialreference.org/ref/epsg/3031/">' +'EPSG:3031</a>: '}),
			new OpenLayers.Control.ScaleLine()	
		]
	},
	center: [397009, 0],
	zoom: 3,
	layers: [
		new OpenLayers.Layer.WMS("Natural Earth I",antarcticWms,{layers: 'antarctic:antarctic_naturalearth'},{isBaseLayer:true}),
		new OpenLayers.Layer.WMS("Lansat7 (LIMA) 240m",antarcticWms,{layers: 'antarctic:antarctica_lima_240m'},{isBaseLayer:true}),
		new OpenLayers.Layer.WMS("Bedmap2 Bed",antarcticWms,{layers: 'antarctic:antarctica_bedmap2_bed'},{isBaseLayer:true}),
		new OpenLayers.Layer.WMS("Measures Velocity",antarcticWms,{layers: 'antarctic:antarctica_measures_velocity_log_magnitude'},{isBaseLayer:true}),
		new OpenLayers.Layer.WMS("Antarctica Coastline",antarcticWms,{layers: 'antarctic:antarctica_coastline',transparent:true},{isBaseLayer:true,visibility:false}),
		
		new OpenLayers.Layer.WMS("Radar Depth Sounder",antarcticWms,{layers: 'antarctic:antarctic_rds_line_paths',transparent:true},{isBaseLayer:false,visibility:true}),
		new OpenLayers.Layer.WMS("Accumulation Radar",antarcticWms,{layers: 'antarctic:antarctic_accum_line_paths',transparent:true},{isBaseLayer:false,visibility:false}),
		new OpenLayers.Layer.WMS("Snow Radar",antarcticWms,{layers: 'antarctic:antarctic_snow_line_paths',transparent:true},{isBaseLayer:false,visibility:false}),
		new OpenLayers.Layer.WMS("KuBand Radar",antarcticWms,{layers: 'antarctic:antarctic_kuband_line_paths',transparent:true},{isBaseLayer:false,visibility:false}),
		
		antarcticSelectedLine = new OpenLayers.Layer.Vector('',{displayInLayerSwitcher:false})
	]
});

var toolbarItems = [];
mapHelp = Ext.create('Ext.button.Button', {
	text: 'map help',
	handler: function() {
		Ext.Ajax.request({
			url: '/resources/maphelp.html',
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
	map: antarcticMapPanel.map,
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
	map: antarcticMapPanel.map,
	text: "measure distance",
	tooltip: "draw a line to measure a distance, click the button again to clear the drawing.",
	enableToggle: true,
	toggleGroup: 'measureTools'	
});
toolbarItems.push(Ext.create('Ext.button.Button', action));
action = Ext.create('GeoExt.Action', {
	itemId: 'areaMeasure',
	control: areaMeasure,
	map: antarcticMapPanel.map,
	text: "measure area",
	tooltip: "draw a polygon to measure an area, click the button again to clear the drawing.",
	enableToggle: true,
	toggleGroup: 'measureTools'
});
toolbarItems.push(Ext.create('Ext.button.Button', action));
toolbarItems.push("-");
toolbarItems.push(Ext.create('Ext.button.Button', {text:'Clear Line Selection',handler: function() {antarcticSelectedLine.removeAllFeatures();},tooltip: "clear the red line selection after browsing echograms."}));
toolbarItems.push("-");
antarcticMapPanel.addDocked([{
	xtype: 'toolbar',
	dock: 'top',
	items: toolbarItems
}]);

antarcticMapPanel.map.events.register(
	"click",
	antarcticMapPanel.map, 
	function(clickPt) {
		
		var clickCoords = antarcticMapPanel.map.getLonLatFromPixel(clickPt.xy);
		
		var selectedSystem = Ext.ComponentQuery.query('#selectedSystem')[0].value;
		var selectedSeasons = Ext.ComponentQuery.query('#selectedSeasons')[0].value;
		var startDate = Ext.ComponentQuery.query('#startDate')[0].getRawValue();
		var stopDate = Ext.ComponentQuery.query('#stopDate')[0].getRawValue();
		
		if (!selectedSystem){alert('ERROR: SELECT SYSTEM IN THE MENU BEFORE CLICKING ON THE MAP.');return}
		if (!selectedSeasons || selectedSeasons.length==0) {useSeasons = false;}else {useSeasons = true;}
		if (!startDate){startDateSeg = '00000000_00';}else{startDateSeg = startDate.concat('_00');}
		if (!stopDate){stopDateSeg = '99999999_99';}else{stopDateSeg = stopDate.concat('_99');}
		
		if (useSeasons) {
			inputJSON = JSON.stringify({"properties": { "location": "antarctic", "x": clickCoords.lon , "y": clickCoords.lat , "season": selectedSeasons, "startseg": startDateSeg, "stopseg": stopDateSeg}});
		}else {
			inputJSON = JSON.stringify({"properties": { "location": "antarctic", "x": clickCoords.lon , "y": clickCoords.lat, "startseg": startDateSeg, "stopseg": stopDateSeg}});
		}
		Ext.getBody().mask("Loading Echogram Browser");
		Ext.Ajax.request({
			type: "POST",
			url: '/ops/get/frame/closest',
			params: {app:selectedSystem,data:inputJSON},
			success: function(response){antarcticRenderClosestFrame(response.responseText)},
			error: function(){alert('ERROR FINDING CLOSEST FRAME ON CLICK EVENT.');}
		});
	}
);

function antarcticRenderClosestFrame(response) {
	
	// decode the response and error check
	responseData = JSON.parse(response);
	if (responseData.status == 0){alert(responseData.data); return};

	// collapse layer tree
	function collapseTree() {
		var treePanel = Ext.ComponentQuery.query('#antarcticTree')[0];
		treePanel.collapse();
	}
	
	// collapse menu
	function collapseMenu() {
		var menusPanel = Ext.ComponentQuery.query('menus')[0];
		menusPanel.collapse();
	}
	
	// render selected line
	function renderLine() {
		antarcticSelectedLine.removeAllFeatures();
		var points = new Array();
		for (idx=0;idx<=responseData.data.X.length;idx++){
			if (!isNaN(responseData.data.X[idx])){
				points.push(new OpenLayers.Geometry.Point(responseData.data.X[idx],responseData.data.Y[idx]))
			}
		};
		var line = new OpenLayers.Geometry.LineString(points);
		var style = {strokeColor: '#FF0000',strokeWidth: 5};
		var linefeature = new OpenLayers.Feature.Vector(line,null,style);
		antarcticSelectedLine.addFeatures([linefeature]);
		antarcticSelectedLine.redraw(true);
	}
	
	// render echogram image
	function renderImage() {
		var cAntarcticImageBrowserPanel = Ext.ComponentQuery.query('#antarcticImageBrowserPanel')[0];
		cAntarcticImageBrowserPanel.removeAll();
		cAntarcticImageBrowserPanel.expand();
		var antarcticEchogramImage = Ext.create('Ext.Img', {
			id: 'antarcticEchogramImage',
			src: responseData.data.echograms[0]
		});
		cAntarcticImageBrowserPanel.add(antarcticEchogramImage);
	}
	
	// execute the selection
	setTimeout(collapseTree,0);
	setTimeout(collapseMenu,100);
	setTimeout(renderLine,500);
	setTimeout(renderImage,900);
	setTimeout(Ext.getBody().unmask(),1000);
};

var antarcticStore = Ext.create('Ext.data.TreeStore', {
	model: 'GeoExt.data.LayerTreeModel',
	root: {
		expanded: true,
		children: [
			{
				plugins: [{
					ptype: 'gx_overlaylayercontainer',
					loader: {store: antarcticMapPanel.layers}
				}],
				expanded: true,
				text: 'Data Layers'
			},
			{
				plugins: [{
					ptype: 'gx_baselayercontainer',
					loader: {store: antarcticMapPanel.layers}
				}],
				expanded: true,
				text: 'Reference Layers'
			}
		]
	}
});

var antarcticTree = Ext.create('GeoExt.tree.Panel', {
	itemId: 'antarcticTree',
	region: 'east',
	title: 'Map Layer Selection',
	width: 200,
	collapsible: true,
	autoScroll: true,
	store: antarcticStore,
	rootVisible: false,
	lines: true
});

var antarcticEchogramPanel = Ext.create('Ext.Panel', {
	layout: 'border',
	itemId: 'antarcticImageBrowserPanel',
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

Ext.define('OPS.view.MapTabs.AntarcticTab.AntarcticTab' ,{
    
    extend: 'Ext.Panel',
	
	layout: 'border',
	defaults: {
		collapsible: false,
		bodyStyle: 'padding:0px'
	},
	
	alias: 'widget.antarctictab',
    title: 'Antarctic',
	
	items: [antarcticEchogramPanel,antarcticMapPanel,antarcticTree]
});
