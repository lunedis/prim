Package.describe({
  name: 'prim-bootstrap',
  summary: '',
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use(['less','nemo64:bootstrap', 'jquery', 'underscore'], ['client', 'server']);
  api.addFiles([
    'lib/client/stylesheets/vendor/custom.bootstrap.less',
    'lib/client/stylesheets/vendor/custom.bootstrap.import.less',
    'lib/client/stylesheets/vendor/custom.bootstrap.json',
    'lib/client/stylesheets/vendor/custom.bootstrap.mixins.import.less',
    'lib/client/stylesheets/vendor/variables.less',
    ], 'client');
});