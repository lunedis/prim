Meteor.methods({
	'dogmaTest': function(fitting) {
		check(fitting, String);
		Desc.init();

		var parse = Desc.ParseEFT(fitting);
		var fit = Desc.FromParse(parse);
		var stats = fit.getStats();
		console.log(stats);

		var fleet = new Desc.Fleet();
		fleet.setSquadCommander(Desc.getStandardLinks1());
		fleet.setWingCommander(Desc.getStandardLinks2());
		fleet.addFit(fit);
		stats = fit.getStats();
		console.log(stats);
	}
});
