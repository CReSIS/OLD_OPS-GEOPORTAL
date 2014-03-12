Ext.define('OPS.store.Systems', {
	extend: 'Ext.data.Store',
	model: 'OPS.model.System',
	proxy: {
		type: 'ajax',
		url: '/ops/get/system/info',
		reader: {
			type: 'json',
			root: 'data'
		}
	},
	autoLoad: true
});