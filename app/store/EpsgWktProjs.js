Ext.define('OPS.store.EpsgWktProjs', {
	extend: 'Ext.data.Store',
    model: 'OPS.model.EpsgWktProj',
    data : [
        {"name":"WGS1984 (EPSG:4326)", "value":"EPSG:4326"},
		{"name":"North Stereographic (EPSG:3413)", "value":"EPSG:3413"},
		{"name":"South Stereographic (EPSG:3031)", "value":"EPSG:3031"}
    ]
});