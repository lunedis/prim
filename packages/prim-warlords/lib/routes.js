Meteor.startup(function() {
	
	Router.route('warlords', {
		action: function() {
			this.render('warlords');
			SEO.set({ title: 'Warlords - ' + Meteor.App.NAME });
		},
		waitOn: function() {
			return Meteor.subscribe('warlords');
		},
		fastRender: true,
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

});