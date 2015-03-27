Router.route('/', function () {
  this.render('home');
  SEO.set({ title: 'Home -' + Meteor.App.NAME });
});

Router.route('fittings', function() {
  this.render('fittings');
  SEO.set({ title: 'Fittings - ' + Meteor.App.NAME });
});

Router.route('warlords', function() {
  this.render('warlords');
  SEO.set({ title: 'warlords - ' + Meteor.App.NAME });
});
