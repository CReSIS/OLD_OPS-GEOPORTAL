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
				scale: 'medium',
				width: 255
			},{
				xtype: 'label',
				html: '<p style="text-align:center;">Authentication not required for CReSIS data.</p>'
			},{
				xtype: 'button',
				itemId: 'requestAccount',
				text: 'Request Account',
				scale: 'medium',
				width: 255
			}
		]

        this.callParent(arguments);
    }
});