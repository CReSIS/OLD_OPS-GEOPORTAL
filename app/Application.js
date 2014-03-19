Ext.define('OPS.Application', {
    name: 'OPS',

    extend: 'Ext.app.Application',

	requires: [
		'OPS.Global',
		'GeoExt.tree.LayerContainer',
		'GeoExt.tree.OverlayLayerContainer',
		'GeoExt.tree.BaseLayerContainer',
		'GeoExt.data.LayerTreeModel',
		'Ext.grid.Panel'
	],
	
    views: [
		'HeaderBar',
		'FooterBar',
		'MapTabs.MapTabs',
		'MapTabs.AntarcticTab.AntarcticTab',
		'MapTabs.ArcticTab.ArcticTab',
		'MapTabs.DownloadTab.DownloadTab',
		'Menus.Menus',
		'Menus.SelectionMenu.SelectionMenu',
		'Menus.LoginMenu.LoginMenu'
    ],

    controllers: [
        'MapTabs','SelectionMenu','LoginMenu'
    ],

    stores: [
        'DownloadTypes','EpsgWktProjs','Systems','FileDownloads'
    ],
	
	models: [
        'DownloadType','EpsgWktProj','System','FileDownload'
    ]
});
