Ext.define('OPS.view.MapTabs.MapTabs' ,{
    
	extend: 'Ext.tab.Panel',
	alias: 'widget.maptabs',
	itemId: 'maptabs',
	
	requires: [
		'OPS.view.MapTabs.ArcticTab.ArcticTab',
		'OPS.view.MapTabs.AntarcticTab.AntarcticTab'
	],
	
	initComponent: function() {
		
		this.items = [
			{
				xtype: 'arctictab',
				collapsible: false,
				header: false
			},{
				xtype: 'antarctictab',
				collapsible: false,
				header: false
			},{
				title: 'CReSIS Data Site',
				xtype: 'box',
				autoEl: {
					tag: 'iframe',
					src: 'https://data.cresis.ku.edu/'
				}
			},{
				title: 'About OpenPolarServer',
				xtype: 'box',
				autoEl: {
					tag: 'iframe',
					src: '/resources/about.html'
				}
			}
		]
		
		this.callParent(arguments);
    }
});
