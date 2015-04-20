Router.route('/', {
	action: function() {
		this.render('home');
  		SEO.set({ title: 'Home -' + Meteor.App.NAME });
	},
	fastRender: true
});

Router.route('fittings', {
	action: function() {
		this.render('fittings');
		SEO.set({ title: 'Fittings - ' + Meteor.App.NAME });
	},
	waitOn: function() {
		return Meteor.subscribe('fittings');
	},
	fastRender: true
});

Router.route('warlords', {
	action: function() {
		this.render('warlords');
		SEO.set({ title: 'warlords - ' + Meteor.App.NAME });
	},
	waitOn: function() {
		return Meteor.subscribe('warlords');
	},
	fastRender: true
});
