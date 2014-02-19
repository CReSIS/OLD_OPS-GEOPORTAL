Ext.define('OPS.Application', {
    name: 'OPS',

    extend: 'Ext.app.Application',

	requires: [
		'OPS.Global',
		'GeoExt.tree.LayerContainer',
		'GeoExt.tree.OverlayLayerContainer',
		'GeoExt.tree.BaseLayerContainer',
		'GeoExt.data.LayerTreeModel'
	],
	
    views: [
		'HeaderBar',
		'FooterBar',
		'MapTabs.MapTabs',
		'MapTabs.AntarcticTab.AntarcticTab',
		'MapTabs.ArcticTab.ArcticTab',
		'Menus.Menus',
		'Menus.SelectionMenu.SelectionMenu'
    ],

    controllers: [
        'MapTabs','SelectionMenu'
    ],

    stores: [
        'DownloadTypes','EpsgWktProjs','Systems'
    ],
	
	models: [
        'DownloadType','EpsgWktProj','System'
    ]
});
