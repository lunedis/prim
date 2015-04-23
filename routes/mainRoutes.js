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

Router.route('fittings/edit/:_id', {
	action: function() {
		this.render('fittings-edit', {
			data: function() {
				return {fit: Fittings.findOne({_id: this.params._id})};
			}
		});
		SEO.set({title: 'Edit Fitting - ' + Meteor.App.NAME});
	},
	waitOn: function() {
		return Meteor.subscribe('fit', this.params._id);
	},
	fastRender: true
});

Router.route('warlords', {
	action: function() {
		this.render('warlords');
		SEO.set({ title: 'Warlords - ' + Meteor.App.NAME });
	},
	waitOn: function() {
		return Meteor.subscribe('warlords');
	},
	fastRender: true
});

Router.route('warlords/edit/:_id', {
	action: function() {
		this.render('warlords-edit', {
			data: function() {
				return {warlord: Warlords.findOne({_id: this.params._id})};
			}
		});
		SEO.set({title: 'Edit Warlord - ' + Meteor.App.NAME});
	},
	waitOn: function() {
		return Meteor.subscribe('warlord', this.params._id);
	},
	fastRender: true
});