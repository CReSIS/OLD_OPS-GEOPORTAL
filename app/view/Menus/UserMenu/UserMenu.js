Ext.define('OPS.view.Menus.UserMenu.UserMenu' ,{
    
	extend: 'Ext.Panel',
	alias: 'widget.usermenu',
    title: 'User Login',

    initComponent: function() {
		
		// HELP DIALOG TOOL
		this.tools = [
			{
				type: 'help',
				dock: 'top',
				handler: function() {Ext.Msg.alert('User Help Dialog','Some Help Information Here.');}
			},
		],
        
		// USER LOGIN ITEMS
		this.items = [
			{
				xtype: 'label',
				html: '<h3 style="text-align:center;">OpenPolarServer Login</h3>',
			},
			{
				xtype: 'textfield',
				fieldLabel: 'Username',
				id: 'username',
			},
			{
				xtype: 'textfield',
				fieldLabel: 'Password',
				id: 'password',
			},
			{
				xtype: 'button',
				text: 'Login',
				scale: 'medium',
				width: 125,
			},
			{
				xtype: 'button',
				text: 'Logout',
				scale: 'medium',
				width: 125,
			},
			{
				xtype: 'label',
				html: '<h1><hr></h1><h3 style="text-align:center;">New User Registration</h3>',
			},
			{
				xtype: 'textfield',
				fieldLabel: 'First Name',
				id: 'newfirstname',
			},
			{
				xtype: 'textfield',
				fieldLabel: 'Last Name',
				id: 'newlastname',
			},
			{
				xtype: 'textfield',
				fieldLabel: 'Email',
				id: 'newemail',
			},
			{
				xtype: 'textfield',
				fieldLabel: 'Username',
				id: 'newusername',
			},
			{
				xtype: 'textfield',
				fieldLabel: 'Password',
				id: 'newpassword',
			},
			{
				xtype: 'textfield',
				fieldLabel: 'Organization',
				id: 'neworginazation',
			},
			{
				xtype: 'button',
				text: 'Register',
				scale: 'medium',
				width: 250,
			},
        ];

        this.callParent(arguments);
    }
});