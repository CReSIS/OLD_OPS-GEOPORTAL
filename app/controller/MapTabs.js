Ext.define('OPS.controller.MapTabs', {
    
	extend: 'Ext.app.Controller',

    views: [
        'MapTabs.MapTabs'
    ],
	
	init: function() {
		
		this.control({
			'#maptabs':{
				tabchange: function() {
					
					var systemCombo = Ext.ComponentQuery.query('#selectedSystem')[0]
					systemCombo.clearValue();
					
					var seasonCombo = Ext.ComponentQuery.query('#selectedSeasons')[0];
					seasonCombo.clearValue();
					
					var menusPanel = Ext.ComponentQuery.query('menus')[0];
					menusPanel.expand();
				
				}
			}
		});
	}
});
