Meteor.methods({
	'dogmaTest': function(fitting) {
		check(fitting, String);
		Desc.init();

		var parse = Desc.ParseEFT(fitting);
		console.log(parse);

		var fit = Desc.FromParse(parse);
		var stats = fit.getStats();
		console.log(stats);
	}
});
