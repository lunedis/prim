Package.describe({
  name: 'prim-warlords',
  summary: '',
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use([
      'iron:router', 'aldeed:collection2','meteorhacks:fast-render', 'underscore'
    ], ['client', 'server']);

  api.use([
      'aldeed:autoform', 'jquery','templating']
    , 'client');


  api.addFiles([
    'lib/routes.js',
    'lib/Warlords.js'
    ], ['client', 'server']);

  api.addFiles([
    'lib/server/publications.js'
    ], 'server');

  api.addFiles([
    'lib/client/views/warlords.html',
    'lib/client/views/warlords.js',
    'lib/client/views/warlords.css',
    'lib/client/views/warlords-edit.html',
    'lib/client/views/warlords-edit.js',
    ], 'client');

  api.export([
    'Warlords'
  ]);
});