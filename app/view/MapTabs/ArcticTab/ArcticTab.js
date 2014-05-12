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
		//new OpenLayers.Layer.WMS('Radar Depth Sounder Crossovers',arcticWms,{layers: 'arctic:arctic_rds_crossover_errors',transparent:true},{isBaseLayer:false,visibility:false}),
		
		new OpenLayers.Layer.WMS('Accumulation Radar',arcticWms,{layers: 'arctic:arctic_accum_line_paths',transparent:true},{isBaseLayer:false,visibility:false}),
		//new OpenLayers.Layer.WMS('Accumulation Radar Crossovers',arcticWms,{layers: 'arctic:arctic_accum_crossover_errors',transparent:true},{isBaseLayer:false,visibility:false}),
		
		new OpenLayers.Layer.WMS('Snow Radar',arcticWms,{layers: 'arctic:arctic_snow_line_paths',transparent:true},{isBaseLayer:false,visibility:false}),
		//new OpenLayers.Layer.WMS('Snow Radar Crossovers',arcticWms,{layers: 'arctic:arctic_snow_crossover_errors',transparent:true},{isBaseLayer:false,visibility:false}),
		
		new OpenLayers.Layer.WMS('KuBand Radar',arcticWms,{layers: 'arctic:arctic_kuband_line_paths',transparent:true},{isBaseLayer:false,visibility:false}),
		//new OpenLayers.Layer.WMS('KuBand Radar Crossovers',arcticWms,{layers: 'arctic:arctic_kuband_crossover_errors',transparent:true},{isBaseLayer:false,visibility:false}),
		
		arcticSelectedLine = new OpenLayers.Layer.Vector('',{displayInLayerSwitcher:false})
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
toolbarItems.push(Ext.create('Ext.button.Button', {text:'Crossovers Menu',handler: function() {Ext.ComponentQuery.query('#Crossovers').open();},tooltip: 'open the crossovers menu.'}));

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
		if (!selectedSeasons || selectedSeasons.length==0) {useSeasons = false;}else {useSeasons = true;}
		if (!startDate){startDateSeg = '00000000_00';}else{startDateSeg = startDate.concat('_00');}
		if (!stopDate){stopDateSeg = '99999999_99';}else{stopDateSeg = stopDate.concat('_99');}
		
		if (useSeasons) {
			inputJSON = JSON.stringify({"properties": { "location": "arctic", "x": clickCoords.lon , "y": clickCoords.lat , "season": selectedSeasons, "startseg": startDateSeg, "stopseg": stopDateSeg}});
		}else {
			inputJSON = JSON.stringify({"properties": { "location": "arctic", "x": clickCoords.lon , "y": clickCoords.lat, "startseg": startDateSeg, "stopseg": stopDateSeg}});
		}
		Ext.getBody().mask("Loading Echogram Browser");
		Ext.Ajax.request({
			type: "POST",
			url: '/ops/get/frame/closest',
			params: {app:selectedSystem,data:inputJSON},
			success: function(response){arcticRenderClosestFrame(response.responseText)},
			error: function(){alert('ERROR FINDING CLOSEST FRAME ON CLICK EVENT.');}
		});
	}
);

function arcticRenderClosestFrame(response) {
	
	// decode the response and error check
	responseData = JSON.parse(response);
	if (responseData.status == 0){alert(responseData.data); return};
	
	// add the echograms to the dropdown menu
	var outEchogramUrls = [];
	var outEchogramNames = ['Echogram','Echogram + Layers'];
	
	for (var i=0;i<responseData.data.echograms.length;i++){
		outEchogramUrls.push([responseData.data.echograms[i],outEchogramNames[i]]);
	};
	
	var echogramCombo = Ext.ComponentQuery.query('#arcticEchogramSelector')[0];
	echogramCombo.setValue('');
	
	echogramStore = new Ext.data.ArrayStore({
		fields: ['echogram_url','echogram_name'],
		data: outEchogramUrls
	});
	
	echogramCombo.bindStore(echogramStore);
	
	// collapse layer tree
	function collapseTree() {
		var treePanel = Ext.ComponentQuery.query('#arcticTree')[0];
		treePanel.collapse();
	}
	
	// collapse menu
	function collapseMenu() {
		var menusPanel = Ext.ComponentQuery.query('menus')[0];
		menusPanel.collapse();
	}
	
	// render selected line
	function renderLine() {
		arcticSelectedLine.removeAllFeatures();
		var points = new Array();
		var startX = responseData.data.X[0];
		var startY = responseData.data.Y[0];
		minGps = responseData.data.gps_time[0];
		for (idx=0;idx<=responseData.data.X.length;idx++){
			if (!isNaN(responseData.data.X[idx])){
				if (responseData.data.gps_time[idx] < minGps){
					minGps = responseData.data.gps_time[idx]
					startX = responseData.data.X[idx]
					startY = responseData.data.Y[idx]
				}
				points.push(new OpenLayers.Geometry.Point(responseData.data.X[idx],responseData.data.Y[idx]))
			}
		};
		var startPoint = new OpenLayers.Geometry.Point(startX,startY);
		var startPointStyle = {fillColor: '#FF0000' ,pointRadius: 10,strokeColor:'#FF0000'};
		var line = new OpenLayers.Geometry.LineString(points);
		var style = {strokeColor: '#FF0000',strokeWidth: 5};
		var lineFeature = new OpenLayers.Feature.Vector(line,null,style);
		var pointFeature = new OpenLayers.Feature.Vector(startPoint,null,startPointStyle);
		arcticSelectedLine.addFeatures([lineFeature,pointFeature]);
		arcticSelectedLine.redraw(true);
	}
	
	// render echogram image
	function renderImage() {
		var cArcticImageBrowserPanel = Ext.ComponentQuery.query('#arcticImageBrowserPanel')[0];
		cArcticImageBrowserPanel.removeAll();
		cArcticImageBrowserPanel.expand();
		var arcticEchogramImage = Ext.create('Ext.Img', {
			id: 'arcticEchogramImage',
			src: responseData.data.echograms[0]
		});
		cArcticImageBrowserPanel.add(arcticEchogramImage);
	}
	
	// execute the selection
	setTimeout(collapseTree,0);
	setTimeout(collapseMenu,100);
	setTimeout(renderLine,500);
	setTimeout(renderImage,900);
	setTimeout(Ext.getBody().unmask(),1000);
};

/*toolbarItems.push(Ext.create('Ext.button.Button', {text:'close echogram browser',handler: arcticCloseEchogramBrowser,tooltip: "close the echogram browser and go back to the normal interface."}));
toolbarItems.push("-");*/
arcticMapPanel.addDocked([{
	xtype: 'toolbar',
	dock: 'top',
	items: toolbarItems
}]);

var arcticStore = Ext.create('Ext.data.TreeStore', {
	model: 'GeoExt.data.LayerTreeModel',
	root: {
		expanded: true,
		children: [
			{
				plugins: [{
					ptype: 'gx_overlaylayercontainer',
					loader: {
						store: arcticMapPanel.layers,
						/*createNode: function(attr) {
						attr.component = {
							xtype: "gx_wmslegend",
							layerRecord: arcticMapPanel.layers.getByLayer(attr.layer),
							showTitle: false,
							cls: "legend"
						};
						return GeoExt.tree.LayerLoader.prototype.createNode.call(this, attr);
						}*/
					}
				}],
				expanded: false,
				text: 'Data Layers'
			},
			{
				plugins: [{
					ptype: 'gx_baselayercontainer',
					loader: {
						store: arcticMapPanel.layers,
						createNode: function(attr) {
						attr.component = {
							xtype: "gx_wmslegend",
							layerRecord: arcticMapPanel.layers.getByLayer(attr.layer),
							showTitle: false,
							cls: "legend"
						};
						return GeoExt.tree.LayerLoader.prototype.createNode.call(this, attr);
						}
					}
				}],
				expanded: false,
				text: 'Reference Layers'
			}
		]
	}
});

var arcticTree = Ext.create('GeoExt.tree.Panel', {
	itemId: 'arcticTree',
	region: 'east',
	title: 'Map Layer Selection',
	width: 250,
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
	dockedItems: [{
		xtype: 'toolbar',
		dock: 'top',
		items: [
			{
				xtype: 'button',
				itemId: 'echogramNotice',
				text: 'Echogram Information',
				scale: 'small',
				width: 150,
				handler: function() {Ext.Msg.alert('NOTICE','Echogram images are static previews and may not represent the most recent data. They should be used for reference only.')}
			},{
				xtype: 'combo',
				fieldLabel: 'Echogram Image',
				itemId: 'arcticEchogramSelector',
				queryMode: 'local',
				displayField: 'echogram_name',
				valueField: 'echogram_url',
				width: 300
			},{
				xtype: 'button',
				itemId: 'arcticLoadEchogramImage',
				text: 'Draw Echogram',
				scale: 'small',
				width: 150,
				handler: function() {
					var cArcticImageBrowserPanel = Ext.ComponentQuery.query('#arcticImageBrowserPanel')[0];
					cArcticImageBrowserPanel.removeAll();
					cArcticImageBrowserPanel.expand();
					var arcticEchogramImage = Ext.create('Ext.Img', {
						id: 'arcticEchogramImage',
						src:  Ext.ComponentQuery.query('#arcticEchogramSelector')[0].value
					});
					cArcticImageBrowserPanel.add(arcticEchogramImage);
				}
			},{
				xtype: 'button',
				itemId: 'arcticCloseEchogramBrowser',
				text: 'Close Echogram Browser',
				scale: 'small',
				width: 150,
				handler: function() {
				
					Ext.getBody().mask("Closing Echogram Browser");

					arcticSelectedLine.removeAllFeatures();

					// collapse layer tree
					function expandTree() {
						var treePanel = Ext.ComponentQuery.query('#arcticTree')[0];
						treePanel.expand();
					}
					
					// collapse menu
					function expandMenu() {
						var menusPanel = Ext.ComponentQuery.query('menus')[0];
						menusPanel.expand();
					}

					// collapse echogram image
					function collapseEchogram() {
						var cArcticImageBrowserPanel = Ext.ComponentQuery.query('#arcticImageBrowserPanel')[0];
						cArcticImageBrowserPanel.collapse();
					}
					
					// execute the selection
					setTimeout(collapseEchogram,0);
					setTimeout(expandTree,100);
					setTimeout(expandMenu,500);
					setTimeout(Ext.getBody().unmask(),900);
				}
			}
		]
	}],
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