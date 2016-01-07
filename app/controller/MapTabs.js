Ext.define('OPS.controller.MapTabs', {
    
	extend: 'Ext.app.Controller',

    views: ['MapTabs.MapTabs'],

	models: ['EpsgWktProj','DownloadType','System'],
    stores: ['EpsgWktProjs','DownloadTypes','Systems'],

	init: function() {
		
		this.control({
			'#maptabs':{
				tabchange: function(tabPanel,newCard,oldCard) {

                    var selectedSystem = Ext.ComponentQuery.query('#selectedSystem')[0].value;

					var newTab = newCard.tab.text;
					var oldTab = oldCard.tab.text;
					
					var menusPanel = Ext.ComponentQuery.query('menus')[0];
					menusPanel.expand();
					
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

					}

                    var systemStore = Ext.getStore('Systems');

			        if(systemStore.getCount() == 0) { systemStore.load(); }

				    systemStore.clearFilter()
				    var distinctSystems = systemStore.collect('system');
				    var outSystems = [];
				    for (var i=0;i<distinctSystems.length;i++){
				        outSystems.push([distinctSystems[i]]);
				    }

				    var systemCombo = Ext.ComponentQuery.query('#selectedSystem')[0]

				    distinctSystemsStore = new Ext.data.ArrayStore({
				        fields: ['system'],
				        data: outSystems
				    });

				    systemCombo.bindStore(distinctSystemsStore);

                    if (!selectedSystem){
						systemCombo.setValue('rds');
					} else {
					    systemCombo.setValue(selectedSystem);
					}
				}
			}
		});
	}
});
