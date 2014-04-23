Ext.define('OPS.view.Menus.LoginMenu.LoginMenu' ,{
    
	extend: 'Ext.Panel',
	alias: 'widget.loginmenu',
    title: 'Menu',
	
    initComponent: function() {

        
		this.items = [
			{
				xtype: 'label',
				html: '<h3 style="text-align:center;">User Login Menu</h3>'
			},{
				xtype: 'textfield',
				emptyText: 'Username',
				itemId: 'username',
				width: 255
			},{
				xtype: 'textfield',
				emptyText: 'Password',
				inputType: 'password',
				itemId: 'password',
				width: 255
			},{
				xtype: 'button',
				itemId: 'userLogin',
				text: 'Login',
				scale: 'small',
				width: 255,
				tooltip: 'Login to the OPS system for access to custom datasets authorized to you by CReSIS.'
			},{
				xtype: 'button',
				itemId: 'userLogout',
				text: 'Logout',
				scale: 'small',
				width: 255,
				tooltip: 'Logout of the OPS system. This will happen automatically.'
			},{
				xtype: 'label',
				html: '<p style="text-align:center;">Authentication not required for CReSIS data.</p>'
			},{
				xtype: 'button',
				itemId: 'requestAccount',
				text: 'Request Account',
				scale: 'medium',
				width: 255,
				tooltip: 'Request an OPS account. Only do this is you have your own non-public data in the OPS system.'
			},{
				xtype: 'label',
				itemId: 'loginStatus',
				html: '<h3 style="text-align:center;">No user logged in.</h3>'
			}
		]

        this.callParent(arguments);
    }
});