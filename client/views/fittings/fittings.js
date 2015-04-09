Template['fittings'].helpers({
});

Template['fittings'].events({
	"click .test": function() {
		Meteor.call("dogmaTest");
	}
});
