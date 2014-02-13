Ext.define('OPS.view.Viewport', {
    extend: 'Ext.container.Viewport',
	
	layout: 'border',
	defaults: {
		collapsible: false,
		split: true,
		bodyStyle: 'padding:15px'
	},
	
	requires: [
		'OPS.view.Menus.Menus',
		'OPS.view.HeaderBar.HeaderBar',
		'OPS.view.FooterBar.FooterBar',
		'OPS.view.MapTabs.MapTabs',
		'OPS.Global'
	],
	
	initComponent: function() {
			
		this.items = [
			// HEADER
			{
				xtype: 'headerbar',
				region: 'north',
				margins: '5 5 5 5',
				height: 0,
				maxSize: 0,
				collapsed: true,
				hideCollapseTool: true,
			},		
			// MENU
			{
				xtype: 'menus',
				region: 'west',
				margins: '0 5 0 5',
				collapsible: true,
				bodyStyle: 'padding:0px',
				width: 300,
				minWidth: 300,
				maxWidth: 300,
			},
			// MAP
			{
				xtype: 'maptabs',
				region: 'center',
				margins: '0 5 0 0',
				bodyStyle: 'padding:0px',
				collapsible: false,
				header: false,
			},
			// FOOTER
			{
				xtype: 'footerbar',
				region: 'south',
				margins: '5 5 5 5',
				height: 0,
				maxSize: 0,
				collapsed: true,
				hideCollapseTool: true,
			},				
		]
		
		this.callParent();
	}
});