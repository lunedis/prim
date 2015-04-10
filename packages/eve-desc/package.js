Package.describe({
  name: 'mikokoel:eve-desc',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Helper and wrapper for libdogma',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.5');

  api.export('Desc', 'server');
  
  api.addFiles('eve-desc.js', 'server');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('mikokoel:eve-desc');
  api.addFiles('eve-desc-tests.js');
});

Npm.depends({
	"ffi": "1.3.0",
	"ref": "1.0.1",
	"ref-struct": "1.0.1",
	"ref-union": "0.0.3"
});
