Meteor.methods({
	'testDesc': function(eft) {
		check(eft, String);

		Desc.init();

	    var parse = Desc.ParseEFT(eft);
	    var fit = Desc.FromParse(parse);
	    var stats = fit.getStats();
	    return stats;
	}
});