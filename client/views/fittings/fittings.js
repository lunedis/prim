Template['fittings'].helpers({
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
