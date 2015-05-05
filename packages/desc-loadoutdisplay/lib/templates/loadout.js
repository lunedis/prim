Meteor.startup(function() {
	Template['rackSmall'].helpers({
		filled: function(modules) {
			return (modules.length > 0);
		}
	});
});