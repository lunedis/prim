Package.describe({
	name: 'prim-base',
	summary: '',
});

Package.onUse(function(api) {
	api.addFiles('lib/base.js',['client', 'server']);

	api.export([
		'navigation'
	]);
});
