Package.describe({
  name: 'prim-fittings',
  summary: '',
});

Package.onUse(function(api) {
  api.use('leokokim:desc','server');

  api.use([
      'prim-base',
      'iron:router', 
      'aldeed:collection2',
      'meteorhacks:fast-render',
      'manuelschoebel:ms-seo',
      'underscore'
    ], ['client', 'server']);

  api.use([
      'aldeed:autoform', 'jquery','templating']
    , 'client');

  api.addFiles([
    'lib/routes.js',
    'lib/Fittings.js',
    'lib/hooks.js'
    ], ['client', 'server']);

  api.addFiles([
    'lib/server/publications.js'
    ], 'server');

  api.addFiles([
    'lib/client/views/fittings.html',
    'lib/client/views/fittings.js',
    'lib/client/views/fittings.css',
    'lib/client/views/fittings-edit.html',
    'lib/client/views/fittings-edit.js',
    ], 'client');

  api.export([
    'Fittings'
  ]);
});