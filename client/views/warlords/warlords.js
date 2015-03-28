Meteor.subscribe('warlords');

Template['warlords'].helpers({
	warlords: function() {
		return Warlords.find({});
	}
});

Template['warlords'].events({
})
