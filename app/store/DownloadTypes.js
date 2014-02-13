Ext.define('OPS.store.DownloadTypes', {
	extend: 'Ext.data.Store',
    model: 'OPS.model.DownloadType',
    data : [
        {"name":"CSV", "value":"csv"},
		{"name":"KML", "value":"kml"},
		//{"name":"MAT", "value":"mat"},
		//{"name":"NETCDF", "value":"netcdf"}
    ]
});