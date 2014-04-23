Ext.define('OPS.store.Systems', {
	extend: 'Ext.data.Store',
	model: 'OPS.model.System',
	proxy: {
		actionMethods: {
		 read: 'POST'
		},
		type: 'ajax',
		url: '/ops/get/system/info',
		extraParams : {
			app : 'noapp',
			data : JSON.stringify({"nodata":"nodata"})
		},
		reader: {
			type: 'json',
			root: 'data'
		}
	},
	autoLoad: false
});