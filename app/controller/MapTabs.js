Ext.define('OPS.controller.MapTabs', {
    
	extend: 'Ext.app.Controller',

    views: [
        'MapTabs.MapTabs'
    ],
	
	init: function() {
		
		this.control({
			'#maptabs':{
				tabchange: function(tabPanel,newCard,oldCard) {
					
					newTab = newCard.tab.text;
					oldTab = oldCard.tab.text;
					
					if ((newTab == "Arctic" && oldTab == "Antarctic") || (newTab == "Antarctic" && oldTab == "Arctic")) {
					
						var startDateCombo = Ext.ComponentQuery.query('#startDate')[0];
						startDateCombo.setValue('19930101');
						
						var stopDateCombo = Ext.ComponentQuery.query('#stopDate')[0];
						stopDateCombo.setValue(new Date());
						
						var systemCombo = Ext.ComponentQuery.query('#selectedSystem')[0];
						systemCombo.clearValue();
						
						var seasonCombo = Ext.ComponentQuery.query('#selectedSeasons')[0];
						seasonCombo.clearValue();
						
						var layersCombo = Ext.ComponentQuery.query('#selectedLayers')[0];
						layersCombo.clearValue();
						
						var wktTextArea = Ext.ComponentQuery.query('#wktText')[0];
						wktTextArea.setValue('');
						
						var wktProjCombo = Ext.ComponentQuery.query('#wktProj')[0];
						wktProjCombo.clearValue();
						
						var menusPanel = Ext.ComponentQuery.query('menus')[0];
						menusPanel.expand();
					
					}
				}
			}
		});
	}
});
