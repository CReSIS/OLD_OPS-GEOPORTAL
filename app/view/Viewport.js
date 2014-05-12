Ext.define('OPS.view.Viewport', {
    extend: 'Ext.container.Viewport',
    
	requires: [
		'OPS.view.Menus.Menus',
		'OPS.view.HeaderBar',
		'OPS.view.FooterBar',
		'OPS.view.MapTabs.MapTabs',
		//'OPS.view.Crossovers.Crossovers',
		'OPS.Global'
	],

	layout: 'border',
	defaults: {
		collapsible: false,
		split: true,
		bodyStyle: 'padding:15px'
	},

	initComponent: function() {
			
		this.items = [{
				xtype: 'headerbar',
				region: 'north',
				margins: '5 5 5 5',
				height: 0,
				maxSize: 0,
				collapsed: true,
				hideCollapseTool: true
			},{
				xtype: 'menus',
				region: 'west',
				margins: '0 5 0 5',
				collapsible: true,
				collapsed: true,
				bodyStyle: 'padding:0px',
				width: 300,
				minWidth: 300,
				maxWidth: 300
			},{
				xtype: 'maptabs',
				region: 'center',
				margins: '0 5 0 0',
				bodyStyle: 'padding:0px',
				collapsible: false,
				header: false
			},{
				xtype: 'footerbar',
				region: 'south',
				margins: '5 5 5 5',
				height: 0,
				maxSize: 0,
				collapsed: true,
				hideCollapseTool: true
			}]
		
		this.callParent();
	}
});