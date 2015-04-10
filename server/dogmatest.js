Meteor.methods({
	'dogmaTest': function(fitting) {
		Desc.init();
		var f = Desc.FromEFT(fitting);
		var stats = f.getStats();
		console.log(stats);
	}
});
