Meteor.methods
  testDesc: (eft) ->
    check eft, String
    Desc.init()

    parse = Desc.ParseEFT eft
    console.log parse
    fit = Desc.FromParse parse
    console.log fit
    stats = fit.getStats()