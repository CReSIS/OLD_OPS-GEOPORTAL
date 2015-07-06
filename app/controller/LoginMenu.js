Ext.define('OPS.controller.LoginMenu', {

	extend: 'Ext.app.Controller',

	views: ['Menus.LoginMenu.LoginMenu'],
	
	models: [],  
	stores: [],
	
	init: function() {

		var username = 'anonymous';
		var password = 'anonymous';
		
		if (! username || ! password) {
			Ext.Msg.alert('ERROR','PLEASE ENTER USERNAME AND PASSWORD');
			return
		};
		
		var inputJSON = JSON.stringify({'properties':{'userName':username,'password':password}});
	
		Ext.Ajax.request({
			method: 'POST',
			url: '/ops/login/user',
			timeout: 1200000,
			params: {'app':'rds','data':inputJSON},
			success: function(response){
				responseJSON = JSON.parse(response.responseText)
				if (responseJSON.status == 1) {
					
					Ext.ComponentQuery.query('#username')[0].setValue('')
					Ext.ComponentQuery.query('#password')[0].setValue('')
					Ext.ComponentQuery.query('#loginStatus')[0].update('<h3 style="text-align:center;">User ' + username + ' logged in.</h3>')
					
				}else if (responseJSON.status == 2){
					Ext.Msg.alert('WARNING',responseJSON.data);
				}else {
					Ext.Msg.alert('ERROR',responseJSON.data);
				}
				
			},
			failure: function() {Ext.Msg.alert('ERROR','UNKOWN ERROR OCCURED.');}
		});
		
		this.control({
			'#userLogin': {
				click: function() {
				
					var username = Ext.ComponentQuery.query('#username')[0].value;
					var password = Ext.ComponentQuery.query('#password')[0].value;
					
					if (! username || ! password) {
						Ext.Msg.alert('ERROR','PLEASE ENTER USERNAME AND PASSWORD');
						return
					}
					
					var inputJSON = JSON.stringify({'properties':{'userName':username,'password':password}})
				
					Ext.Ajax.request({
						method: 'POST',
						url: '/ops/login/user',
						timeout: 1200000,
						params: {'app':'rds','data':inputJSON},
						success: function(response){
							responseJSON = JSON.parse(response.responseText)
							if (responseJSON.status == 1) {
								
								Ext.Msg.alert('NOTICE',responseJSON.data);
								Ext.ComponentQuery.query('#username')[0].setValue('')
								Ext.ComponentQuery.query('#password')[0].setValue('')
								Ext.ComponentQuery.query('#loginStatus')[0].update('<h3 style="text-align:center;">User ' + username + ' logged in.</h3>')
								var systemStore = Ext.getStore('Systems');
								systemStore.load();
								
							}else if (responseJSON.status == 2){
								Ext.Msg.alert('WARNING',responseJSON.data);
							}else {
								Ext.Msg.alert('ERROR',responseJSON.data);
							}
						},
						failure: function() {Ext.Msg.alert('ERROR','UNKOWN ERROR OCCURED.');}
					});

				}
			},
			'#userLogout': {
				click: function() {
				
					Ext.Ajax.request({
						method: 'POST',
						url: '/ops/logout/user',
						timeout: 1200000,
						params: {},
						success: function(response){
							responseJSON = JSON.parse(response.responseText)
							if (responseJSON.status == 1) {
								
								Ext.Msg.alert('NOTICE',responseJSON.data);
								Ext.ComponentQuery.query('#username')[0].setValue('')
								Ext.ComponentQuery.query('#password')[0].setValue('')
								Ext.ComponentQuery.query('#loginStatus')[0].update('<h3 style="text-align:center;">No user logged in.</h3>')
								var systemStore = Ext.getStore('Systems');
								systemStore.removeAll()
								Ext.Msg.alert('NOTICE','PLEASE LOGIN OR REFRESH PAGE TO CONTINUE.')
								
							}else if (responseJSON.status == 2){
								Ext.Msg.alert('WARNING',responseJSON.data);
							}else {
								Ext.Msg.alert('ERROR',responseJSON.data);
							}
						},
						failure: function() {Ext.Msg.alert('ERROR','UNKOWN ERROR OCCURED.');}
					});

				}
			},
			'#requestAccount': {
				click: function() {
				
					Ext.Msg.alert('Notice','The OpenPolarServer does not currently require authentication for download of CReSIS data. If you have a custom dataset in the OPS system and have not already recieved an OPS user account please contact us at <a href="mailto:cresis_data@cresis.ku.edu">cresis_data@cresis.ku.edu</a>');
				
				}
			}
		});
	}
});