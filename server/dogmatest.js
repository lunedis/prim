Meteor.methods({
	'dogmaTest': function(fitting) {
		check(fitting, String);
		Desc.init();
		var fleet = new Desc.Fleet();
		var fit = Desc.FromEFT(fitting);
		fleet.setCommander(Desc.getSkirmishLoki());
		fleet.addFit(fit);

		var stats = fit.getStats();
		console.log(stats);
	}
});
