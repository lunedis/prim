Package.describe({
	name: 'desc-loadoutdisplay',
	summary: '',
});

Package.onUse(function(api) {
	api.use(['jquery', 'templating'], 'client');

	api.addFiles([
		'lib/templates/loadout.html',
		'lib/templates/loadout.js'
	], 'client');
});