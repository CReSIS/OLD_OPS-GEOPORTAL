Ext.define('OPS.controller.LoginMenu', {

	extend: 'Ext.app.Controller',

	views: ['Menus.LoginMenu.LoginMenu'],
	
	models: [],  
	stores: [],
	
	init: function() {
		
		this.control({
		
			'#userLogin': {
				click: function() {
				
					Ext.Msg.alert('Notice','The OpenPolarServer does not currently require authentication.');
				
				}
			},
		
			'#requestAccount': {
				click: function() {
				
					Ext.Msg.alert('Notice','The OpenPolarServer does not currently require authentication.');
				
				}
			}
		});
	}
});