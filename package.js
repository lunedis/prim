Package.describe({
  name: 'leokokim:desc',
  version: '0.2.0',
  // Brief, one-line summary of the package.
  summary: 'Helper and wrapper for libdogma',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.use('coffeescript', ['server', 'client']);
  api.use('livedata', 'server');

  api.export('Desc', ['server', 'client']);
  api.export('DescFitting', 'server');
  api.export('DescFleet', 'server');

  api.addFiles('invtypes.coffee', 'server');
  api.addFiles('libdogmaffi.coffee', 'server');
  api.addFiles('desc-dps.coffee', ['server', 'client'])
  api.addFiles('desc.coffee', 'server');
  api.addFiles('methods.coffee', 'server');
});

Package.onTest(function(api) {
  api.use('coffeescript');
  api.use('tinytest');
  api.use('leokokim:desc');
  api.addFiles('libdogmaffi-tests.coffee', 'server');
  api.addFiles('desc-tests.coffee', 'server');
  api.addFiles('desc-dps-tests.coffee', ['server', 'client']);
});

Npm.depends({
	"ffi": "1.3.0",
	"ref": "1.0.1",
	"ref-struct": "1.0.1",
	"ref-union": "0.0.3"
});