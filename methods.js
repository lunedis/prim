Meteor.methods({
	'testDesc': function(eft) {
		check(eft, String);

		Desc.init();

	    var parse = Desc.ParseEFT(eft);
	    var fit = Desc.FromParse(parse);
	    var tank = fit.getTank();
	    var navigation = fit.getNavigation();
	    return _.extend(tank, navigation);
	    return tank;
	}
});