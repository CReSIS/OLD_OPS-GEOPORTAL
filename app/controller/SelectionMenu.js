// CONTROLLER FOR ALL THE FUNCTIONS ON THE MAIN MENU
Ext.define('OPS.controller.SelectionMenu', {
    
	extend: 'Ext.app.Controller',

    views: ['Menus.SelectionMenu.SelectionMenu'],
	
	// DEFINE STORES/MODELS FOR THE VIEW
    models: ['EpsgWktProj','DownloadType','System'/*,'Layer'*/],  
    stores: ['EpsgWktProjs','DownloadTypes','Systems'/*,'Layers'*/],
	
	init: function() {
		
		this.control({
		
			// APPLY FILTERS TO MAP HANDLER
			'#applyFilters':{
				click: function() {
				
					// GET THE ACTIVE MAP PANEL
					var curTab = Ext.ComponentQuery.query('maptabs')[0].getActiveTab().title;
					if (curTab === 'Arctic') {
						var curMapPanel = arcticMapPanel;
					}else if (curTab === 'Antarctic') {
						var curMapPanel = antarcticMapPanel;
					}else{
						alert('SYSTEM ERROR: Only Arctic/Antarctic Supported');
					};
					
					// GET REQUIRED VARIABLES FROM THE VIEW
					var selectedSystem = Ext.ComponentQuery.query('#selectedSystem')[0].value;
					var selectedSeasons = Ext.ComponentQuery.query('#selectedSeasons')[0].value;
					//var selectedLayers = Ext.ComponentQuery.query('#selectedLayers')[0].value;
					var startDate = Ext.ComponentQuery.query('#startDate')[0].getRawValue();
					var stopDate = Ext.ComponentQuery.query('#stopDate')[0].getRawValue();
				
					if (!selectedSystem){
						// CHECK THAT SYSTEM IS SET
						alert('ERROR: System must be selected');
					}else{
					
						// CHECK SEASONS/LAYERS AND SET DEFAULTS IF NEEDED
						if (!selectedSeasons) { 
							selectedSeasons = '';
						}
						/*if (!selectedLayers){
							selectedLayers = '';
						}*/
						
						// SET START AND STOP DATE (DEFAULTS IF NEEDED)
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
						
						// BUILD THE PARAM STRING
						if (selectedSeasons.length > 0){
							
							// FORMAT FOR MULTIPLE SEASONS
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
						
						// ADD THE VIEWPARAMS TO THE WMS LAYER
						if (selectedSystem === 'rds'){
							updateLayer = curMapPanel.map.getLayersByName('Radar Depth Sounder')[0];
						}else if (selectedSystem === 'accum'){
							updateLayer = curMapPanel.map.getLayersByName('Accumulation Radar')[0];
						}else if (selectedSystem === 'kuband'){
							updateLayer = curMapPanel.map.getLayersByName('KuBand Radar')[0];
						}else if (selectedSystem === 'snow'){
							updateLayer = curMapPanel.map.getLayersByName('Snow Radar')[0];
						}
						
						// UPDATE AND REDRAW THE LAYER
						updateLayer.params.viewparams = paramStr;
						updateLayer.redraw(true);
					
					}
				}
			},
		
			// SET THE DEFAULT VALUES FOR THE LAYER COMBO
			/*'#selectedLayers':{
				afterrender: function () {
				
					var layerCombo = Ext.ComponentQuery.query('#selectedLayers')[0]
					layerCombo.setValue(['surface','bottom']);
					
				}
			},*/
			
			// SYSTEMS COMBO AND SEASONS COMBO MANAGMENT
			'#selectedSystem':{
				focus: function() { // FILTER TO ONLY SHOW DISTINCT LIST OF SYSTEM
					
					var curTab = Ext.ComponentQuery.query('maptabs')[0].getActiveTab().title;
					curLocation = curTab.toLowerCase();
					
					// GET THE UNIQUE SYSTEMS FROM THE STORE
					var systemStore = Ext.getStore('Systems');
					systemStore.clearFilter()
					var distinctSystems = systemStore.collect('system');
					var outSystems = [];
					for (var i=0;i<distinctSystems.length;i++){
						outSystems.push([distinctSystems[i]]);
					}

					// GET THE COMBOBOX
					var systemCombo = Ext.ComponentQuery.query('#selectedSystem')[0]
					
					// BUILD THE ARRAY STORE
					distinctSystemsStore = new Ext.data.ArrayStore({
						fields: ['system'],
						data: outSystems
					});
					
					// CLEAR THEN SAVE THE STORE
					systemCombo.bindStore(distinctSystemsStore);
					
				},
				change: function() { // POPULATE '#selectedSeasons' WITH ONLY SEASONS FOR THE SELECTED SYSTEM
					
					// GET THE SELECTED SYSTEM
					var curSystem = Ext.ComponentQuery.query('#selectedSystem')[0].value
					
					// GET THE UNIQUE SEASONS FROM THE STORE (FOR THE SELECTED SYSTEM)
					var systemStore = Ext.getStore('Systems');
					systemStore.clearFilter()
					systemStore.filter('system',curSystem);
					systemStore.filter('location',curLocation);
					var distinctSeasons = systemStore.collect('season');
					var outSeasons = [];
					for (var i=0;i<distinctSeasons.length;i++){
						outSeasons.push([distinctSeasons[i]]);
					}
					// GET THE COMBOBOX
					var seasonCombo = Ext.ComponentQuery.query('#selectedSeasons')[0]
					
					// BUILD THE ARRAY STORE
					distinctSeasonsStore = new Ext.data.ArrayStore({
						fields: ['season'],
						data: outSeasons
					});
					
					// BIND THE NEW STORE
					seasonCombo.bindStore(distinctSeasonsStore);
				}
			},
		
			// SET THE MAXIMUM START DATA
			'#stopDate': {
				change: function() {
					var stopDateValue = Ext.ComponentQuery.query('#stopDate')[0].value
					Ext.ComponentQuery.query('#startDate')[0].setMaxValue(stopDateValue)
				}
			},
			
			// SET THE MINIMUM STOP DATE
			'#startDate': {
				change: function() {
					var startDateValue = Ext.ComponentQuery.query('#startDate')[0].value
					Ext.ComponentQuery.query('#stopDate')[0].setMinValue(startDateValue)
				}
			},
			
			// DRAWING HANDLER
			'#drawPolygon': {
                click: function() {
		
					// GET THE ACTIVE MAP PANEL AND SET SOME VALUES
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
					
					// CLEAR ANY EXISTING DRAWINGS BY REMOVING ANY EXISTING LAYER
					if (typeof(polygonBoundary) !== 'undefined') {
						curMapPanel.map.removeLayer(polygonBoundary);
						delete polygonBoundary;
					}
					
					// ADD A VECTOR LAYER TO THE MAP
					polygonBoundary = new OpenLayers.Layer.Vector(
						'',
						{
							displayInLayerSwitcher:false,
							styleMap: new OpenLayers.StyleMap({fillColor:'white',fillOpacity:0.5,strokeColor:'#333333',strokeWidth:1,strokeOpacity:1,pointRadius:4,graphicName:'square'}),
						}
					)
					curMapPanel.map.addLayer(polygonBoundary)
				
					// CREATE AND ADD DRAW CONTROLS TO THE MAP
					var drawControls = {polygon: new OpenLayers.Control.DrawFeature(polygonBoundary,OpenLayers.Handler.Polygon)};
					for(var key in drawControls) {
						curMapPanel.map.addControl(drawControls[key]);
					}
					
					// DEACTIVATE DRAWING CONTROLS ON DOUBLE-CLICK (END OF DRAWING)
					drawControls['polygon'].events.register("featureadded",' ',endDraw);
					function endDraw(){
						drawControls['polygon'].deactivate(); 

						// ZOOM TO THE DRAWING EXTENT
						curMapPanel.map.zoomToExtent(polygonBoundary.getDataExtent());
						
						// TRANSFORM TO WGS84
						var polygonBoundaryWGS84  = polygonBoundary.features[0].geometry.transform(new OpenLayers.Projection(outEPSG),new OpenLayers.Projection("EPSG:4326"));

						// WRITE WKT TO THE WKT TEXTAREA
						Ext.ComponentQuery.query('#wktText')[0].setValue(polygonBoundaryWGS84)
						Ext.ComponentQuery.query('#wktProj')[0].setValue('EPSG:4326')
						
						// TRANSFORM BACK TO MAP PROJECTION
						polygonBoundary.features[0].geometry.transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection(outEPSG));
					};

					// ACTIVATE DRAWING
					drawControls['polygon'].activate();
		
				}
            },
			
			// DRAWING CLEARING HANDLER
			'#clearDrawing': {
                click: function() {
				
					// GET THE ACTIVE MAP PANEL
					var curTab = Ext.ComponentQuery.query('maptabs')[0].getActiveTab().title
					if (curTab === 'Arctic') {
						var curMapPanel = arcticMapPanel;	
					}else if (curTab === 'Antarctic') {
						var curMapPanel = antarcticMapPanel;
					}else{
						alert('SYSTEM ERROR: Only Arctic/Antarctic Supported');
					}
					
					// CLEAR ANY EXISTING DRAWINGS BY REMOVING ANY EXISTING LAYER
					curMapPanel.map.removeLayer(polygonBoundary);
					delete polygonBoundary;
					
					// ZOOM OUT A LEVEL (FORCES A MAP REFRESH)
					curMapPanel.map.zoomOut()

				}
            },
			
			// WKT RENDERING HANDLER
			'#renderWkt': {
                click: function() {

					// GET THE DEFINED PROJECTION
					var inEPSG = Ext.ComponentQuery.query('#wktProj')[0].value;
					if(inEPSG !== null) {
					
						// GET THE WKT FROM THE TEXTAREA
						var wktString = Ext.ComponentQuery.query('#wktText')[0].value;
						
						// MAKE SURE wktString IS VALID
						if(wktString !== undefined && wktString.length > 0) {
						
							// READ THE WKT TEXT
							var wkt = new OpenLayers.Format.WKT();
							var inFeature = wkt.read(wktString);
							
							// GET THE ACTIVE MAP PANEL
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
							
							// ADD A VECTOR LAYER
							polygonBoundary = new OpenLayers.Layer.Vector(
								'',
								{
									displayInLayerSwitcher:false,
									styleMap: new OpenLayers.StyleMap({fillColor:'#DFE8F6',fillOpacity:0.7,strokeColor:'#000000'}),
								}
							)
							curMapPanel.map.addLayer(polygonBoundary)
							
							// CREATE AND ADD DRAW CONTROLS TO THE MAP
							var drawControls = {polygon: new OpenLayers.Control.DrawFeature(polygonBoundary,OpenLayers.Handler.Polygon)};
							for(var key in drawControls) {curMapPanel.map.addControl(drawControls[key]);};
							
							// ACTIVATE - ADD FEATURES TO POLYBOUND - DEACTIVATE
							drawControls['polygon'].activate();
							polygonBoundary.addFeatures(inFeature);
							polygonBoundary.features[0].geometry.transform(new OpenLayers.Projection(inEPSG),new OpenLayers.Projection(outEPSG));
							drawControls['polygon'].deactivate();
							
							// ZOOM TO WKT EXTENT
							curMapPanel.map.zoomToExtent(polygonBoundary.getDataExtent());
							
						}else{
							// ALERT USER THAT THERE IS NO WKT
							alert('INPUT ERROR: WKT Polygon not defined.');
						}
					
					}else{
						// ALERT USER THAT THERE IS NO PROJ
						alert('INPUT ERROR: WKT Projection not selected.');
					}
				}
            },
			
			// DATA DOWNLOAD HANDLER/S
			'#downloadData': {
				click: function() {
					
					// GET THE ACTIVE MAP PANEL
					var curTab = Ext.ComponentQuery.query('maptabs')[0].getActiveTab().title;
					if (curTab === 'Arctic') {
						var inEPSG = "EPSG:3413";
					}else if (curTab === 'Antarctic') {
						var inEPSG = "EPSG:3031";
					}else{
						alert('SYSTEM ERROR: Only Arctic/Antarctic Supported');
					};
					
					// GET REQUIRED VARIABLES FROM THE VIEW
					var outFormat = Ext.ComponentQuery.query('#outFormat')[0].value;
					var selectedSystem = Ext.ComponentQuery.query('#selectedSystem')[0].value;
					var selectedSeasons = Ext.ComponentQuery.query('#selectedSeasons')[0].value;
					//var selectedLayers = Ext.ComponentQuery.query('#selectedLayers')[0].value;
					var startDate = Ext.ComponentQuery.query('#startDate')[0].getRawValue();
					var stopDate = Ext.ComponentQuery.query('#stopDate')[0].getRawValue();
					
					if (typeof(polygonBoundary) === 'undefined') { 
						// CONFIRM THAT THE polygonBoundary EXISTS
						alert('ERROR: Polygon Boundary must be created using Draw Polygon or Render WKT');
					}else if (!outFormat) { 
						// CHECK THAT DOWNLOAD TYPE IS SET
						alert('ERROR: Output Format must be set.');
					}else if (!selectedSystem){
						// CHECK THAT SYSTEM IS SET
						alert('ERROR: System must be selected');
					}else {
					
						// CHECK SEASONS/LAYERS AND SET DEFAULTS IF NEEDED
						if (!selectedSeasons) { 
							selectedSeasons = "";
						}
						/*if (!selectedLayers){
							selectedLayers = "";
						} */
						
						// SET START AND STOP DATE (DEFAULTS IF NEEDED)
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
					
						// USER PROMPT TO CONFIRM DOWNLOAD SETTINGS
						Ext.Msg.alert({
							title:'Confirm Download', 
							msg:'Your file will now be generated (could take a few minutes) and automatically begin to download. Note the URL in the download window, your file will be available at this location for 7 days. While the download is prepared you can continue to use the portal. Please be cautious of your download size, for large data requests (multiple seasons) contact us at CReSIS (see the CReSIS Data Site tab).',
							buttons: Ext.Msg.OKCANCEL,
							fn: function(btn){
								if (btn == 'ok'){
									
									// TRANSFORM THE BOUNDARY TO WGS1984 AND WRITE WKT
									polygonBoundary.features[0].geometry.transform(new OpenLayers.Projection(inEPSG),new OpenLayers.Projection("EPSG:4326"));
									var wkt = new OpenLayers.Format.WKT();
									var outWkt = wkt.write(polygonBoundary.features[0]);
					
									// BUILD DOWNLOAD PARAMS
									var inputJSON = JSON.stringify({'bound':outWkt,'location':curTab.toLowerCase(),'startseg':startDateSeg,'stopseg':stopDateSeg});

									// DOWNLOAD THE SPECIFIED FORMAT
									if (outFormat === 'csv') {
										// REQUEST CSV FILE (SURFACE/BOTTOM ONLY)
										Ext.Ajax.request({
											method: 'POST',
											url: '/ops/get/layer/points/csv',
											params: {'app':selectedSystem,'data':inputJSON},
											success: function(response){
												// GET THE URL FROM THE RESPONSE JSON
												responseJSON = JSON.parse(response.responseText)
												// ERROR CHECK RESPONSE (STATUS VARIABLE)
												window.open(responseJSON.data,'Your File is Ready','width=600,height=200');
											},
											failure: function() {alert('ERROR: UNKOWN ERROR OCCURED.');}
										});
									}else if (outFormat === 'kml'){
										// DOWNLOAD KML FILE (PATH ONLY)
										Ext.Ajax.request({
											method: 'POST',
											url: '/ops/get/layer/points/kml',
											params: {'app':selectedSystem,'data':inputJSON},
											success: function(response){
												// GET THE URL FROM THE RESPONSE JSON
												responseJSON = JSON.parse(response.responseText)
												// ERROR CHECK RESPONSE (STATUS VARIABLE)
												window.open(responseJSON.data,'Your File is Ready','width=600,height=200');
											},
											failure: function() {alert('ERROR: UNKOWN ERROR OCCURED.');}
										});
									}else if (outFormat === 'mat'){
										// DONWLOAD MAT FILE
										alert('ERROR: MAT FORMAT OUTPUT IN DEVELOPMENT');
									}else if (outFormat === 'netcdf'){
										// DOWNLOAD NETCDF FILE
										alert('ERROR: NETCDF FORMAT OUTPUT IN DEVELOPMENT');
									}else{
										alert('ERROR: OUTPUT FORMAT NOT CURRENTLY SUPPORTED');
									}
									
									// TRANSFORM THE BOUNDARY BACK FROM WGS1984
									polygonBoundary.features[0].geometry.transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection(inEPSG));
					
								}
							}
						});
					}
				}
			},
		});
	}
});
