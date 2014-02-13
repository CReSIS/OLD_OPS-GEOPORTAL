Ext.define('OPS.view.HeaderBar.HeaderBar' ,{
    
	extend: 'Ext.Panel',
	alias: 'widget.headerbar',
    title: 'CReSIS OpenPolarServer (OPS) GeoPortal',
	titleAlign: 'center',

    initComponent: function() {

        this.callParent(arguments);
    }
});