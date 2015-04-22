Meteor.subscribe('warlords');

Template['warlords'].helpers({
	warlords: function() {
		return _.sortBy(Warlords.find({}).fetch(),'characterName');
	}
});

Template['warlords'].events({
})
