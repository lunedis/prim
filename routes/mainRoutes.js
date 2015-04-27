Router.route('/', {
	name: 'home',
	action: function() {
		this.render('home');
  		SEO.set({ title: 'Home - ' + Meteor.App.NAME });
	},
	waitOn: function() {
		return [Meteor.subscribe('fittings'), Meteor.subscribe('warlords')];
	},
	fastRender: true
});