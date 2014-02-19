Ext.define('OPS.view.Menus.SelectionMenu.SelectionMenu' ,{
    
	extend: 'Ext.Panel',
	alias: 'widget.selectionmenu',
    title: 'Menu',
	
    initComponent: function() {

		this.tools = [{
			type: 'help',
			dock: 'top',
			handler: function() {
				Ext.Ajax.request({
					url: '/app/help/help.html',
					success: function(response){
						Ext.create('Ext.window.Window',{
							title: 'Map Help Documentation',
							height: 600,
							width: 600,
							layout: 'fit',
							autoScroll: true,
							closable: true,
							padding: '10 10 10 10',
							items: [{
								xtype: 'label',
								html: response.responseText
							}]
						}).show()
					}
				});
			}
		}],
        
		this.items = [
			{
				xtype: 'label',
				html: '<h3 style="text-align:center;">Basic Selection Filters</h3>'
			},{
				xtype: 'combo',
				fieldLabel: 'Select System',
				itemId: 'selectedSystem',
				queryMode: 'local',
				displayField: 'system',
				valueField: 'system'
			},{
					xtype: 'datefield',
					fieldLabel: 'Start Date',
					itemId: 'startDate',
					format: 'Ymd',
					value: '19930101',
					maxValue: new Date()
			},{
					xtype: 'datefield',
					fieldLabel: 'End Date',
					itemId: 'stopDate',
					format: 'Ymd',
					value: new Date(),
					minValue: '18000101'
			},{
				xtype: 'combo',
				fieldLabel: 'Select Season/s',
				itemId: 'selectedSeasons',
				queryMode: 'local',
				displayField: 'season',
				valueField: 'season',
				multiSelect: true
			},/*{
				xtype: 'combo',
				fieldLabel: 'Select Layer/s',
				itemId: 'selectedLayers',
				store: 'Layers',
				queryMode: 'local',
				displayField: 'name',
				valueField: 'name',
				multiSelect: true
			},*/
			{
				xtype: 'button',
				itemId: 'applyFilters',
				text: 'Apply Filters To Map',
				scale: 'small',
				width: 255,
				tooltip: 'Redraw layers on the map based on the above selected filters. Dont forget to change the layer in the "Map Layer Selection" panel.'
			},{
				xtype: 'label',
				html: '<h1><hr></h1><h3 style="text-align:center;">Spatial Selection Filters</h3>'
			},{
				xtype: 'button',
				itemId: 'drawPolygon',
				text: 'Draw A Polygon',
				scale: 'small',
				width: 127.5,
				tooltip: 'Draw a polygon on the map to select an area for download, see map help for more.'
			},{
				xtype: 'button',
				itemId: 'clearDrawing',
				text: 'Clear Drawing',
				scale: 'small',
				width: 127.5,
				tooltip: 'Clear any drawing made on the map. This is also applied by clicking "Draw A Polygon" again.'
			},{
				xtype: 'label',
				html: '<p style="text-align:center;">OR Type/Paste WKT Polygon</p>'
			},{
				xtype: 'textarea',
				itemId: 'wktText',
				emptyText: 'POLYGON((x1 y1,x2 y2,x1 y1))',
				resizable: true,
				minWidth: 255,
				maxWidth: 255,
				width: 255,
				height: 50,
				minHeight: 50
			},{
				xtype: 'combo',
				fieldLabel: 'WKT Projection',
				itemId: 'wktProj',
				store: 'EpsgWktProjs',
				queryMode: 'local',
				autoSelect: true,
				displayField: 'name',
				valueField: 'value'
			},{
				xtype: 'button',
				itemId: 'renderWkt',
				text: 'Render WKT Text',
				scale: 'small',
				width: 255,
				tooltip: 'Render the WKT Polygon to the map using the defined WKT Projection.'
			},{
				xtype: 'label',
				html: '<h1><hr></h1><h3 style="text-align:center;">Download Settings</h3>'
			},{
				xtype: 'combo',
				fieldLabel: 'Output Format',
				itemId: 'outFormat',
				store: 'DownloadTypes',
				queryMode: 'local',
				displayField: 'name',
				valueField: 'value'
			},{
				xtype: 'button',
				itemId: 'downloadData',
				text: 'Download File',
				scale: 'large',
				width: 255,
				tooltip: 'Using all of the above filters and the selected region download data in the specified format.'
			}
		]

        this.callParent(arguments);
    }
});