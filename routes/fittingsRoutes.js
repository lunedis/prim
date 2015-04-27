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