Ext.define('OPS.view.Crossovers.Crossovers' ,{
    
	extend: 'Ext.Panel',
	alias: 'widget.crossovers',
	title: 'Crossovers Menu',
		
	defaults: {
		draggable: true,
		floating: true,
		hidden: true
	},
	
	requires: [],
	
	initComponent: function() {
		this.items = [
			{
				xtype: 'datefield',
				fieldLabel: 'Start date'
			}, {
				xtype: 'datefield',
				fieldLabel: 'End date'
			}
		]
		this.callParent(arguments);
    }
});