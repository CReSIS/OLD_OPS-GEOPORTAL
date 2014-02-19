Ext.define('OPS.view.Menus.Menus' ,{
    
	extend: 'Ext.Panel',
	alias: 'widget.menus',
	title: 'Menu',
	
	layout: 'accordion',
	
	defaults: {
        titleCollapse: false,
        animate: true
	},
	
	requires: [
		'OPS.view.Menus.SelectionMenu.SelectionMenu'
	],
	
	initComponent: function() {
		this.items = [{
			xtype: 'selectionmenu',
			region: 'south',
			collapsible: true,
			bodyStyle: 'padding:15px',
			overflowY: 'auto'
		}]
		this.callParent(arguments);
    }
});