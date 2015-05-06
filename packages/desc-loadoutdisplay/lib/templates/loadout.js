Meteor.startup(function() {
	Template['rackSmall'].helpers({
		filled: function(modules) {
			return (modules.length > 0);
		}
	});

	Template['eft'].events({
		'click .eft': function(event) {
			SelectText(event.target);
		}
	});
});