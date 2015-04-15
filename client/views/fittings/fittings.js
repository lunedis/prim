Meteor.subscribe('fittings');

Template['fittings'].helpers({
	fits: function() {
		return Fittings.find({});
	},
	filled: function(modules) {
		return (modules.length > 0);
	}
});

Template['fittings'].events({
	"submit .test": function() {
		try {
			var text = event.target.text.value;
			Meteor.call("dogmaTest", text);	
		} catch (e) {
			throw new Meteor.Error(500,e.reason, e.details);
		}
	}
});

Template['rackSmall'].helpers({
	filled: function(modules) {
		return (modules.length > 0);
	}
});