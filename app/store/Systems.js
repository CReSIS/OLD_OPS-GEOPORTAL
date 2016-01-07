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
			app : 'rds',
			data : JSON.stringify({"properties":{
			    'username':'anonymous',
			    'isAuthenticated':true,
			    'mat':true}})
		},
		reader: {
			type: 'json',
			root: 'data'
		}
	},
	autoLoad: false
});