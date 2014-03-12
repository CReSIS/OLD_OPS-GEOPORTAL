Ext.define('OPS.model.FileDownload', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id', type: 'integer'},
		{name: 'location', type: 'string'},
		{name: 'status', type: 'string'},
		{name: 'stime', type: 'string'},
		{name: 'ftime', type: 'string'},
		{name: 'type', type: 'string'},
		{name: 'url',  type: 'string'}
	]
});