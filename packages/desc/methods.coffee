Meteor.methods
	testDesc: (eft) ->
		check eft, String
		Desc.init()

		fit = Desc.FromEFT eft
		stats = fit.getStats()