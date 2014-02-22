Ext.define('OPS.controller.SelectionMenu', {
    
	extend: 'Ext.app.Controller',

    views: ['Menus.SelectionMenu.SelectionMenu'],
	
    models: ['EpsgWktProj','DownloadType','System'],  
    stores: ['EpsgWktProjs','DownloadTypes','Systems'],
	
	init: function() {
		
		this.control({
		
			'#applyFilters':{
				click: function() {
				
					var curTab = Ext.ComponentQuery.query('maptabs')[0].getActiveTab().title;
					if (curTab === 'Arctic') {
						var curMapPanel = arcticMapPanel;
					}else if (curTab === 'Antarctic') {
						var curMapPanel = antarcticMapPanel;
					}else{
						alert('SYSTEM ERROR: Only Arctic/Antarctic Supported');
					};
					
					var selectedSystem = Ext.ComponentQuery.query('#selectedSystem')[0].value;
					var selectedSeasons = Ext.ComponentQuery.query('#selectedSeasons')[0].value;
					var startDate = Ext.ComponentQuery.query('#startDate')[0].getRawValue();
					var stopDate = Ext.ComponentQuery.query('#stopDate')[0].getRawValue();
				
					if (!selectedSystem){
						alert('ERROR: System must be selected');
					}else{
					
						if (!selectedSeasons) { 
							selectedSeasons = '';
						}
						if (!startDate){
							startDateSeg = '00000000_00';
						}else{
							startDateSeg = startDate.concat('_00');
						}
						if (!stopDate){
							stopDateSeg = '99999999_99';
						}else{
							stopDateSeg = stopDate.concat('_99');
						}
						
						if (selectedSeasons.length > 0){
							
							outStr = '';
							for (var i=0;i<selectedSeasons.length;i++){
								if (i < selectedSeasons.length-1){
									outStr = outStr + "'" +selectedSeasons[i] + "'"+ '\\,';
								}else{
									outStr = outStr + "'" +selectedSeasons[i] + "'"+ ';';
								}
							}
							paramStr = "start_seg:'"+startDateSeg+"';stop_seg:'"+stopDateSeg+"';season_name:"+outStr
						}else {
							paramStr = "start_seg:'"+startDateSeg+"';stop_seg:'"+stopDateSeg+"'"
						}
						
						if (selectedSystem === 'rds'){
							updateLayer = curMapPanel.map.getLayersByName('Radar Depth Sounder')[0];
						}else if (selectedSystem === 'accum'){
							updateLayer = curMapPanel.map.getLayersByName('Accumulation Radar')[0];
						}else if (selectedSystem === 'kuband'){
							updateLayer = curMapPanel.map.getLayersByName('KuBand Radar')[0];
						}else if (selectedSystem === 'snow'){
							updateLayer = curMapPanel.map.getLayersByName('Snow Radar')[0];
						}
						
						updateLayer.params.viewparams = paramStr;
						updateLayer.redraw(true);
					
					}
				}
			},
			
			'#selectedSystem':{
				focus: function() {
					
					var curTab = Ext.ComponentQuery.query('maptabs')[0].getActiveTab().title;
					curLocation = curTab.toLowerCase();
					
					var systemStore = Ext.getStore('Systems');
					systemStore.clearFilter()
					var distinctSystems = systemStore.collect('system');
					var outSystems = [];
					for (var i=0;i<distinctSystems.length;i++){
						outSystems.push([distinctSystems[i]]);
					}

					var systemCombo = Ext.ComponentQuery.query('#selectedSystem')[0]
					
					distinctSystemsStore = new Ext.data.ArrayStore({
						fields: ['system'],
						data: outSystems
					});
					
					systemCombo.bindStore(distinctSystemsStore);
					
				},
				change: function() {
					
					var curSystem = Ext.ComponentQuery.query('#selectedSystem')[0].value
					
					var systemStore = Ext.getStore('Systems');
					systemStore.clearFilter()
					systemStore.filter('system',curSystem);
					systemStore.filter('location',curLocation);
					var distinctSeasons = systemStore.collect('season');
					var outSeasons = [];
					for (var i=0;i<distinctSeasons.length;i++){
						outSeasons.push([distinctSeasons[i]]);
					}
					var seasonCombo = Ext.ComponentQuery.query('#selectedSeasons')[0]
					
					distinctSeasonsStore = new Ext.data.ArrayStore({
						fields: ['season'],
						data: outSeasons
					});
					
					seasonCombo.bindStore(distinctSeasonsStore);
				}
			},
		
			'#stopDate': {
				change: function() {
					var stopDateValue = Ext.ComponentQuery.query('#stopDate')[0].value
					Ext.ComponentQuery.query('#startDate')[0].setMaxValue(stopDateValue)
				}
			},
			
			'#startDate': {
				change: function() {
					var startDateValue = Ext.ComponentQuery.query('#startDate')[0].value
					Ext.ComponentQuery.query('#stopDate')[0].setMinValue(startDateValue)
				}
			},
			
			'#drawPolygon': {
                click: function() {
		
					var curTab = Ext.ComponentQuery.query('maptabs')[0].getActiveTab().title
					if (curTab === 'Arctic') {
						var outEPSG = "EPSG:3413";
						var curMapPanel = arcticMapPanel;	
					}else if (curTab === 'Antarctic') {
						var outEPSG = "EPSG:3031";
						var curMapPanel = antarcticMapPanel;
					}else{
						alert('SYSTEM ERROR: Only Arctic/Antarctic Supported');
					}
					
					if (typeof(polygonBoundary) !== 'undefined') {
						curMapPanel.map.removeLayer(polygonBoundary);
						delete polygonBoundary;
					}
					
					polygonBoundary = new OpenLayers.Layer.Vector(
						'',
						{
							displayInLayerSwitcher:false,
							styleMap: new OpenLayers.StyleMap({fillColor:'white',fillOpacity:0.5,strokeColor:'#333333',strokeWidth:1,strokeOpacity:1,pointRadius:4,graphicName:'square'})
						}
					)
					curMapPanel.map.addLayer(polygonBoundary)
				
					var drawControls = {polygon: new OpenLayers.Control.DrawFeature(polygonBoundary,OpenLayers.Handler.Polygon)};
					for(var key in drawControls) {
						curMapPanel.map.addControl(drawControls[key]);
					}
					
					drawControls['polygon'].events.register("featureadded",' ',endDraw);
					function endDraw(){
						drawControls['polygon'].deactivate(); 

						curMapPanel.map.zoomToExtent(polygonBoundary.getDataExtent());
						
						var polygonBoundaryWGS84  = polygonBoundary.features[0].geometry.transform(new OpenLayers.Projection(outEPSG),new OpenLayers.Projection("EPSG:4326"));

						Ext.ComponentQuery.query('#wktText')[0].setValue(polygonBoundaryWGS84)
						Ext.ComponentQuery.query('#wktProj')[0].setValue('EPSG:4326')
						
						polygonBoundary.features[0].geometry.transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection(outEPSG));
					};

					drawControls['polygon'].activate();
		
				}
            },
			
			'#clearDrawing': {
                click: function() {
				
					var curTab = Ext.ComponentQuery.query('maptabs')[0].getActiveTab().title
					if (curTab === 'Arctic') {
						var curMapPanel = arcticMapPanel;	
					}else if (curTab === 'Antarctic') {
						var curMapPanel = antarcticMapPanel;
					}else{
						alert('SYSTEM ERROR: Only Arctic/Antarctic Supported');
					}
					
					curMapPanel.map.removeLayer(polygonBoundary);
					delete polygonBoundary;
					
					curMapPanel.map.zoomOut()

				}
            },
			
			'#renderWkt': {
                click: function() {

					var inEPSG = Ext.ComponentQuery.query('#wktProj')[0].value;
					if(inEPSG !== null) {
					
						var wktString = Ext.ComponentQuery.query('#wktText')[0].value;
						
						if(wktString !== undefined && wktString.length > 0) {
						
							var wkt = new OpenLayers.Format.WKT();
							var inFeature = wkt.read(wktString);
							
							var curTab = Ext.ComponentQuery.query('maptabs')[0].getActiveTab().title;
							if (curTab === 'Arctic') {
								var outEPSG = "EPSG:3413";
								var curMapPanel = arcticMapPanel;	
							}else if (curTab === 'Antarctic') {
								var outEPSG = "EPSG:3031";
								var curMapPanel = antarcticMapPanel;
							}else{
								alert('SYSTEM ERROR: Only Arctic/Antarctic Supported');
							};
							
							polygonBoundary = new OpenLayers.Layer.Vector(
								'',
								{
									displayInLayerSwitcher:false,
									styleMap: new OpenLayers.StyleMap({fillColor:'#DFE8F6',fillOpacity:0.7,strokeColor:'#000000'})
								}
							)
							curMapPanel.map.addLayer(polygonBoundary)
							
							var drawControls = {polygon: new OpenLayers.Control.DrawFeature(polygonBoundary,OpenLayers.Handler.Polygon)};
							for(var key in drawControls) {curMapPanel.map.addControl(drawControls[key]);};
							
							drawControls['polygon'].activate();
							polygonBoundary.addFeatures(inFeature);
							polygonBoundary.features[0].geometry.transform(new OpenLayers.Projection(inEPSG),new OpenLayers.Projection(outEPSG));
							drawControls['polygon'].deactivate();
							
							curMapPanel.map.zoomToExtent(polygonBoundary.getDataExtent());
							
						}else{
							alert('INPUT ERROR: WKT Polygon not defined.');
						}
					
					}else{
						alert('INPUT ERROR: WKT Projection not selected.');
					}
				}
            },
			
			'#downloadData': {
				click: function() {
					
					var curTab = Ext.ComponentQuery.query('maptabs')[0].getActiveTab().title;
					if (curTab === 'Arctic') {
						var inEPSG = "EPSG:3413";
					}else if (curTab === 'Antarctic') {
						var inEPSG = "EPSG:3031";
					}else{
						alert('SYSTEM ERROR: Only Arctic/Antarctic Supported');
					};
					
					var outFormat = Ext.ComponentQuery.query('#outFormat')[0].value;
					var selectedSystem = Ext.ComponentQuery.query('#selectedSystem')[0].value;
					var selectedSeasons = Ext.ComponentQuery.query('#selectedSeasons')[0].value;
					var startDate = Ext.ComponentQuery.query('#startDate')[0].getRawValue();
					var stopDate = Ext.ComponentQuery.query('#stopDate')[0].getRawValue();
					
					if (typeof(polygonBoundary) === 'undefined') { 
						alert('ERROR: Polygon Boundary must be created using Draw Polygon or Render WKT');
					}else if (!outFormat) { 
						alert('ERROR: Output Format must be set.');
					}else if (!selectedSystem){
						alert('ERROR: System must be selected');
					}else {
					
						if (!selectedSeasons) { 
							selectedSeasons = "";
						}
						
						if (!startDate){
							startDateSeg = '00000000_00';
						}else{
							startDateSeg = startDate.concat('_00');
						}
						if (!stopDate){
							stopDateSeg = '99999999_99';
						}else{
							stopDateSeg = stopDate.concat('_99');
						}
					
						Ext.Msg.alert({
							title:'Confirm Download', 
							msg:'Your file will now be generated (could take a few minutes) and automatically begin to download. Note the URL in the download window, your file will be available at this location for 7 days. While the download is prepared you can continue to use the portal. Please be cautious of your download size, for large data requests (multiple seasons) contact us at CReSIS (see the CReSIS Data Site tab).',
							buttons: Ext.Msg.OKCANCEL,
							fn: function(btn){
								if (btn == 'ok'){
									
									polygonBoundary.features[0].geometry.transform(new OpenLayers.Projection(inEPSG),new OpenLayers.Projection("EPSG:4326"));
									var wkt = new OpenLayers.Format.WKT();
									var outWkt = wkt.write(polygonBoundary.features[0]);
					
									var inputJSON = JSON.stringify({'bound':outWkt,'location':curTab.toLowerCase(),'properties':{'startseg':startDateSeg,'stopseg':stopDateSeg}});

									if (outFormat === 'csv') {
										Ext.Ajax.request({
											method: 'POST',
											url: '/ops/get/layer/points/csv',
											params: {'app':selectedSystem,'data':inputJSON},
											success: function(response){
												responseJSON = JSON.parse(response.responseText)
												window.open(responseJSON.data,'Your File is Ready','width=600,height=200');
											},
											failure: function() {alert('ERROR: UNKOWN ERROR OCCURED.');}
										});
									}else if (outFormat === 'kml'){
										Ext.Ajax.request({
											method: 'POST',
											url: '/ops/get/layer/points/kml',
											params: {'app':selectedSystem,'data':inputJSON},
											success: function(response){
												responseJSON = JSON.parse(response.responseText)
												window.open(responseJSON.data,'Your File is Ready','width=600,height=200');
											},
											failure: function() {alert('ERROR: UNKOWN ERROR OCCURED.');}
										});
									}else if (outFormat === 'mat'){
										alert('ERROR: MAT FORMAT OUTPUT IN DEVELOPMENT');
									}else if (outFormat === 'netcdf'){
										alert('ERROR: NETCDF FORMAT OUTPUT IN DEVELOPMENT');
									}else{
										alert('ERROR: OUTPUT FORMAT NOT CURRENTLY SUPPORTED');
									}
									
									polygonBoundary.features[0].geometry.transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection(inEPSG));
					
								}
							}
						});
					}
				}
			}
		});
	}
});