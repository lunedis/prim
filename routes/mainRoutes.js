Router.route('/', {
	name: 'home',
	action: function() {
		this.render('home');
  		SEO.set({ title: 'Home - ' + Meteor.App.NAME });
	},
	fastRender: true
});