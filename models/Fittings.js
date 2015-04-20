Fittings = new Mongo.Collection('fittings');

// Collection2 already does schema checking
// Add custom permission rules if needed
if (Meteor.isServer) {
  Fittings.allow({
    insert : function () {
      return false;
    },
    update : function () {
      return false;
    },
    remove : function () {
      return false;
    }
  });

  Meteor.methods({
    'addFitting': function(fitting) {
      check(fitting, String);
      Desc.init();

      var parse = Desc.ParseEFT(fitting);
      var fit = Desc.FromParse(parse);
      var stats = fit.getStats();
      var fleet = new Desc.Fleet();
      fleet.setSquadCommander(Desc.getStandardLinks1());
      fleet.setWingCommander(Desc.getStandardLinks2());
      fleet.addFit(fit);
      var statsLinked = fit.getStats();


      var dbEntry = {subtitle: "", difficulty: "", role: "", description: "",
                      tips: [], fittingDoctor: {}};
      _.extend(dbEntry, parse);
      dbEntry.stats = stats;
      dbEntry.statsLinked = statsLinked;

      console.log(dbEntry);
      //Fittings.insert(dbEntry);
    }
  });
}
