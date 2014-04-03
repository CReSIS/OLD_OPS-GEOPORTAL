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
						Ext.Msg.alert('SYSTEM ERROR','Make sure you are on the Arctic or Antarctic tab.');
					};
					
					var selectedSystem = Ext.ComponentQuery.query('#selectedSystem')[0].value;
					var selectedSeasons = Ext.ComponentQuery.query('#selectedSeasons')[0].value;
					var startDate = Ext.ComponentQuery.query('#startDate')[0].getRawValue();
					var stopDate = Ext.ComponentQuery.query('#stopDate')[0].getRawValue();
				
					if (!selectedSystem){
						Ext.Msg.alert('ERROR','System must be selected');
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
					systemStore.filter('public',true);
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
					
					distinctSeasonsStore.sort('season','ASC');
					
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
						Ext.Msg.alert('SYSTEM ERROR','Make sure you are on the Arctic or Antarctic tab.');
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
						Ext.Msg.alert('SYSTEM ERROR','Make sure you are on the Arctic or Antarctic tab.');
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
								Ext.Msg.alert('SYSTEM ERROR','Make sure you are on the Arctic or Antarctic tab.');
							};
							
							polygonBoundary = new OpenLayers.Layer.Vector(
								'',
								{
									displayInLayerSwitcher:false,
									styleMap: new OpenLayers.StyleMap({fillColor:'white',fillOpacity:0.5,strokeColor:'#333333',strokeWidth:1,strokeOpacity:1,pointRadius:4,graphicName:'square'})
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
							Ext.Msg.alert('INPUT ERROR','WKT Polygon not defined.');
						}
					
					}else{
						Ext.Msg.alert('INPUT ERROR','WKT Projection not selected.');
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
						Ext.Msg.alert('SYSTEM ERROR','Make sure you are on the Arctic or Antarctic tab.');
						return
					};
					
					var outFormat = Ext.ComponentQuery.query('#outFormat')[0].value;
					var selectedSystem = Ext.ComponentQuery.query('#selectedSystem')[0].value;
					var selectedSeasons = Ext.ComponentQuery.query('#selectedSeasons')[0].value;
					var startDate = Ext.ComponentQuery.query('#startDate')[0].getRawValue();
					var stopDate = Ext.ComponentQuery.query('#stopDate')[0].getRawValue();
					var selectedLayers = Ext.ComponentQuery.query('#selectedLayers')[0].value;
					
					if (typeof(polygonBoundary) === 'undefined') { 
						Ext.Msg.alert('ERROR','Polygon Boundary must be created using Draw Polygon or Render WKT');
					}else if (!outFormat) { 
						Ext.Msg.alert('ERROR','Output Format must be set.');
					}else if (!selectedSystem){
						Ext.Msg.alert('ERROR','System must be selected');
					}else {
					
						if (!selectedSeasons || selectedSeasons.length!=0) {
							useSeasons = true
						}else {
							useSeasons = false
						}
						
						if (!selectedLayers || selectedLayers.length!=0) {
							useLayers = true
						}else {
							useLayers = false
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
							msg:'The file will now be downloaded, see the downloads tab for status and results. Please be patient. While the download is processed you can continue to use the OpenPolarServer and even submit more download requests. The files will be available at the download link for 7 days.',
							buttons: Ext.Msg.OKCANCEL,
							fn: function(btn){
								if (btn == 'ok'){
									
									polygonBoundary.features[0].geometry.transform(new OpenLayers.Projection(inEPSG),new OpenLayers.Projection("EPSG:4326"));
									var wkt = new OpenLayers.Format.WKT();
									var outWkt = wkt.write(polygonBoundary.features[0]);
									
									if (outFormat === 'csv-good' || outFormat === 'csv' || outFormat === 'kml') {
										if (useSeasons) {
											var inputJSON = JSON.stringify({'properties':{'bound':outWkt,'location':curTab.toLowerCase(),'startseg':startDateSeg,'stopseg':stopDateSeg,'season':selectedSeasons}});
										}else {
											var inputJSON = JSON.stringify({'properties':{'bound':outWkt,'location':curTab.toLowerCase(),'startseg':startDateSeg,'stopseg':stopDateSeg}});
										}
									}else if (outFormat === 'mat'){
										if (useSeasons && useLayers) {
											var inputJSON = JSON.stringify({'properties':{'bound':outWkt,'location':curTab.toLowerCase(),'startseg':startDateSeg,'stopseg':stopDateSeg,'season':selectedSeasons,'layers':selectedLayers}});
										}else if (useSeasons){
											var inputJSON = JSON.stringify({'properties':{'bound':outWkt,'location':curTab.toLowerCase(),'startseg':startDateSeg,'stopseg':stopDateSeg,'season':selectedSeasons}});
										}else if (useLayers){
											var inputJSON = JSON.stringify({'properties':{'bound':outWkt,'location':curTab.toLowerCase(),'startseg':startDateSeg,'stopseg':stopDateSeg,'layers':selectedLayers}});
										}else {
											var inputJSON = JSON.stringify({'properties':{'bound':outWkt,'location':curTab.toLowerCase(),'startseg':startDateSeg,'stopseg':stopDateSeg}});
										}
									}else{
										Ext.Msg.alert('NOTIC','OUTPUT FORMAT NOT CURRENTLY SUPPORTED');
										return
									}
									
									fileDownloadStore = Ext.data.StoreManager.lookup('FileDownloads');
									
									if (outFormat === 'csv-good') {
										downloadId = Math.floor(Math.random()*1000000);
										fileDownloadStore.add({'id':downloadId,'location':curTab,'status':'Processing','stime':new Date().toLocaleTimeString(),'ftime':'','type':'csv-good','url':''});
										fileDownloadStore.commitChanges();
										function getCsvGood(selectedSystem,inputJSON,downloadId) {
											tmp = Ext.Ajax.request({
												method: 'POST',
												url: '/ops/get/layer/points/csv',
												timeout: 1200000,
												params: {'app':selectedSystem,'data':inputJSON},
												success: function(response){
													fileDownloadStore = Ext.data.StoreManager.lookup('FileDownloads');
													responseJSON = JSON.parse(response.responseText)
													if (responseJSON.status == 1) {
														outRecord = fileDownloadStore.findRecord('id',downloadId);
														outRecord.data.status = 'Complete';
														outRecord.data.url = responseJSON.data;
														outRecord.data.ftime = new Date().toLocaleTimeString();
														outRecord.commit()
														Ext.Msg.alert('NOTICE','Download is ready, see the Downloads tab.');
													}else {
														outRecord = fileDownloadStore.findRecord('id',downloadId);
														outRecord.data.status = 'Error';
														outRecord.data.ftime = new Date().toLocaleTimeString();
														outRecord.commit();
														Ext.Msg.alert('ERROR',responseJSON.data);
													}
												},
												failure: function() {Ext.Msg.alert('ERROR','UNKOWN ERROR OCCURED.');}
											});
										}
										getCsvGood(selectedSystem,inputJSON,downloadId);
									}else if (outFormat === 'csv') {
										tmpJSON = JSON.parse(inputJSON);
										tmpJSON.properties.allPoints = true;
										inputJSON = JSON.stringify(tmpJSON);
										downloadId = Math.floor(Math.random()*1000000);
										fileDownloadStore.add({'id':downloadId,'location':curTab,'status':'Processing','stime':new Date().toLocaleTimeString(),'ftime':'','type':'csv','url':''});
										fileDownloadStore.commitChanges();
										function getCsv(selectedSystem,inputJSON,downloadId) {
											tmp = Ext.Ajax.request({
												method: 'POST',
												url: '/ops/get/layer/points/csv',
												timeout: 1200000,
												params: {'app':selectedSystem,'data':inputJSON},
												success: function(response){
													fileDownloadStore = Ext.data.StoreManager.lookup('FileDownloads');
													responseJSON = JSON.parse(response.responseText)
													if (responseJSON.status == 1) {
														outRecord = fileDownloadStore.findRecord('id',downloadId);
														outRecord.data.status = 'Complete';
														outRecord.data.url = responseJSON.data;
														outRecord.data.ftime = new Date().toLocaleTimeString();
														outRecord.commit()
														Ext.Msg.alert('NOTICE','Download is ready, see the Downloads tab.');
													}else {
														outRecord = fileDownloadStore.findRecord('id',downloadId);
														outRecord.data.status = 'Error';
														outRecord.data.ftime = new Date().toLocaleTimeString();
														outRecord.commit();
														Ext.Msg.alert('ERROR',responseJSON.data);
													}
												},
												failure: function() {Ext.Msg.alert('ERROR','UNKOWN ERROR OCCURED.');}
											});
										}
										getCsv(selectedSystem,inputJSON,downloadId);
									}else if (outFormat === 'kml'){
										downloadId = Math.floor(Math.random()*1000000);
										fileDownloadStore.add({'id':downloadId,'location':curTab,'status':'Processing','stime':new Date().toLocaleTimeString(),'ftime':'','type':'kml','url':''});
										fileDownloadStore.commitChanges();
										function getKml(selectedSystem,inputJSON,downloadId) {
											tmp = Ext.Ajax.request({
												method: 'POST',
												url: '/ops/get/layer/points/kml',
												timeout: 1200000,
												params: {'app':selectedSystem,'data':inputJSON},
												success: function(response){
													fileDownloadStore = Ext.data.StoreManager.lookup('FileDownloads');
													responseJSON = JSON.parse(response.responseText)
													if (responseJSON.status == 1) {
														outRecord = fileDownloadStore.findRecord('id',downloadId);
														outRecord.data.status = 'Complete';
														outRecord.data.url = responseJSON.data;
														outRecord.data.ftime = new Date().toLocaleTimeString();
														outRecord.commit();
														Ext.Msg.alert('NOTICE','Download is ready, see the Downloads tab.');
													}else {
														outRecord = fileDownloadStore.findRecord('id',downloadId);
														outRecord.data.status = 'Error';
														outRecord.data.ftime = new Date().toLocaleTimeString();
														outRecord.commit();
														Ext.Msg.alert('ERROR',responseJSON.data);
													}
														
												},
												failure: function() {Ext.Msg.alert('ERROR','UNKOWN ERROR OCCURED.');}
											});
										}
										getKml(selectedSystem,inputJSON,downloadId);
									}else if (outFormat === 'mat'){
										downloadId = Math.floor(Math.random()*1000000);
										fileDownloadStore.add({'id':downloadId,'location':curTab,'status':'Processing','stime':new Date().toLocaleTimeString(),'ftime':'','type':'mat','url':''});
										fileDownloadStore.commitChanges();
										function getMat(selectedSystem,inputJSON,downloadId) {
											tmp = Ext.Ajax.request({
												method: 'POST',
												url: '/ops/get/layer/points/mat',
												timeout: 1200000,
												params: {'app':selectedSystem,'data':inputJSON},
												success: function(response){
													fileDownloadStore = Ext.data.StoreManager.lookup('FileDownloads');
													responseJSON = JSON.parse(response.responseText)
													if (responseJSON.status == 1) {
														outRecord = fileDownloadStore.findRecord('id',downloadId);
														outRecord.data.status = 'Complete';
														outRecord.data.url = responseJSON.data;
														outRecord.data.ftime = new Date().toLocaleTimeString();
														outRecord.commit();
														Ext.Msg.alert('NOTICE','Download is ready, see the Downloads tab.');
													}else {
														outRecord = fileDownloadStore.findRecord('id',downloadId);
														outRecord.data.status = 'Error';
														outRecord.data.ftime = new Date().toLocaleTimeString();
														outRecord.commit();
														Ext.Msg.alert('ERROR',responseJSON.data);
													}
														
												},
												failure: function() {Ext.Msg.alert('ERROR','UNKOWN ERROR OCCURED.');}
											});
										}
										getMat(selectedSystem,inputJSON,downloadId);
									}else if (outFormat === 'netcdf'){
										Ext.Msg.alert('NOTICE','NETCDF FORMAT OUTPUT IN DEVELOPMENT');
									}else{
										Ext.Msg.alert('NOTICE','OUTPUT FORMAT NOT CURRENTLY SUPPORTED');
									}
									
									polygonBoundary.features[0].geometry.transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection(inEPSG));
					
								}
							}
						});
					}
				}
			},
			
			'#selectedLayers': {
				focus: function() {
				
					var curSystem = Ext.ComponentQuery.query('#selectedSystem')[0].value
				
					if (!curSystem){
							Ext.Msg.alert('ERROR','System must be selected');
							return
						};
						
						inputJSON = JSON.stringify({"none":"none"});
						
						Ext.Ajax.request({
							method: 'POST',
							url: '/ops/get/layers',
							timeout: 1200000,
							params: {'app':curSystem,'data':inputJSON},
							success: function(response){
								
								responseJSON = JSON.parse(response.responseText);
								
								var outLayers = [];
								for (var i=0;i<responseJSON.data.lyr_name.length;i++){
									if (responseJSON.data.lyr_name[i] !== 'surface') {
										outLayers.push([responseJSON.data.lyr_name[i]]);
									}
								};
								
								var layersCombo = Ext.ComponentQuery.query('#selectedLayers')[0];
						
								layerStore = new Ext.data.ArrayStore({
									fields: ['lyr_name'],
									data: outLayers
								});
								
								layerStore.sort('lyr_name','ASC');
								
								layersCombo.bindStore(layerStore);
								
								layersCombo.setValue('bottom');
							
							},
							failure: function() {Ext.Msg.alert('ERROR','UNKOWN ERROR OCCURED.');}
						});
					}
			}
		});
	}
});