Ext.define('OPS.view.Menus.Menus' ,{
    
	extend: 'Ext.Panel',
	alias: 'widget.menus',
	title: 'Menu',
	
	layout: 'accordion',
	
	defaults: {
		collapsed: true,
        titleCollapse: false,
        animate: true
	},
	
	requires: [
		'OPS.view.Menus.SelectionMenu.SelectionMenu',
		'OPS.view.Menus.LoginMenu.LoginMenu'
	],
	
	initComponent: function() {
		this.items = [
		{
			xtype: 'selectionmenu',
			region: 'south',
			collapsible: true,
			bodyStyle: 'padding: 0px 15px 5px 15px',
			overflowY: 'auto',
			title: 'Data Selection'
		},{
			xtype: 'loginmenu',
			region: 'north',
			collapsible: true,
			bodyStyle: 'padding:15px',
			overflowY: 'auto',
			title: 'User Login'
		}]
		this.callParent(arguments);
    }
});