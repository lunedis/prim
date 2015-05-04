Meteor.methods({
	'testDesc': function(eft) {
		check(eft, String);

		Desc.init();

	    var parse = Desc.ParseEFT(eft);
	    var fit = Desc.FromParse(parse);
	    var stats = {};
	    stats.tank = fit.getTank();
	    stats.navigation = fit.getNavigation();
	    stats.damage = fit.getDamage();
	    return stats;
	}
});