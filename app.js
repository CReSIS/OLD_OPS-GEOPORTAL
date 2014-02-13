// LOADER FOR EXT/GEOGEXT
Ext.Loader.setConfig({
	enabled: true,
	disableCaching: false,
	paths: {
		GeoExt: "geoext/src/GeoExt",
		Ext: "ext/src"
	}
});

// REQUIRE NEEDED CLASSES (MAINLY FOR MAP+TREE)
Ext.require([
	'GeoExt.tree.LayerContainer',
    'GeoExt.tree.OverlayLayerContainer',
    'GeoExt.tree.BaseLayerContainer',
    'GeoExt.data.LayerTreeModel',
]);

// DEFINE AN EXT APPLICATION
Ext.application({
    name: 'OPS',
    autoCreateViewport: true,
	
	// DEFINE STORES/MODELS FOR THE APPLICATION
    models: ['EpsgWktProj','DownloadType','System'/*,'Layer'*/],  
    stores: ['EpsgWktProjs','DownloadTypes','Systems'/*,'Layers'*/],
	
	// DEFINE CONTROLLERS FOR THE APPLICATION
    controllers: ['SelectionMenu','MapTabs']
});
