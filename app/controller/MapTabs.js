Ext.define('OPS.controller.MapTabs', {
    
	extend: 'Ext.app.Controller',

    views: [
        'MapTabs.MapTabs',
    ],
	
	init: function() {
		
		this.control({
		
			// RESET STUFF WHEN THE TAB IS CHANGED
			'#maptabs':{
				tabchange: function() {
					
					// CLEAR THE SYSTEM SELECTION
					var systemCombo = Ext.ComponentQuery.query('#selectedSystem')[0]
					systemCombo.clearValue();
					
					// CLEAR THE SEASONS SELECTION
					var seasonCombo = Ext.ComponentQuery.query('#selectedSeasons')[0];
					seasonCombo.clearValue();
					
					// EXPAND THE MENU PANEL
					var menusPanel = Ext.ComponentQuery.query('menus')[0];
					menusPanel.expand();
				
				}
			}
		});
	}
});
