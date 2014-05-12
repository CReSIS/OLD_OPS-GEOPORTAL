Ext.define('OPS.view.MapTabs.MapTabs' ,{
    
	extend: 'Ext.tab.Panel',
	alias: 'widget.maptabs',
	itemId: 'maptabs',
	
	requires: [
		'OPS.view.MapTabs.ArcticTab.ArcticTab',
		'OPS.view.MapTabs.AntarcticTab.AntarcticTab',
		'OPS.view.MapTabs.DownloadTab.DownloadTab',
		'OPS.view.Crossovers.Crossovers'
	],
	
	initComponent: function() {
		
		this.items = [
			{
				title: 'OpenPolarServer',
				xtype: 'box',
				autoEl: {
					tag: 'iframe',
					src: '/resources/about.html'
				}
			},{
				xtype: 'arctictab',
				collapsible: false,
				header: false
			},{
				xtype: 'antarctictab',
				collapsible: false,
				header: false
			},{
				title: 'Downloads',
				xtype: 'downloadtab',
				collapsible: false
			},{
				title: 'CReSIS Data Site',
				xtype: 'box',
				autoEl: {
					tag: 'iframe',
					src: 'https://data.cresis.ku.edu/'
				}
			}
		]
		
		this.callParent(arguments);
    }
});
