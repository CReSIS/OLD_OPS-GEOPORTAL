Ext.define('OPS.view.MapTabs.DownloadTab.DownloadTab', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.downloadtab',
	
	initComponent: function() {
	
		this.store = Ext.data.StoreManager.lookup('FileDownloads'),
		this.columns = [
			{text:'Download Id',dataIndex:'id',width:15,align:'center',sortable:false,hideable:false},
			{text:'Location',dataIndex:'location',width:15,align:'center',sortable:false,hideable:false},
			{text:'Download Status',dataIndex:'status',width:15,align:'center',sortable:false,hideable:false},
			{text:'Started',dataIndex:'stime',width:15,align:'center',sortable:false,hideable:false},
			{text:'Finished',dataIndex:'ftime',width:15,align:'center',sortable:false,hideable:false},
			{text:'Download Type',dataIndex:'type',width:15,align:'center',sortable:false,hideable:false},
			{text:'Download Link',dataIndex:'url',renderer: function(value){return '<a href="'+value+'"target="_blank">'+value+'</a>'},sortable:false,hideable:false}
		],
		this.forceFit = true
	
		this.callParent(arguments);
		
	}
});