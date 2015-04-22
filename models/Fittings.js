Fittings = new Mongo.Collection('fittings');

Fittings.attachSchema(
  new SimpleSchema({
  subtitle: {
    type: String,
    max: 100,
    label: "Subtitle",
  },
  difficulty: {
    type: String,
    label: "Difficulty",
    allowedValues: ["", "easy", "medium", "hard"],
    optional: true
  },
  role: {
    type: String,
    label: "Role",
    max: 50
  },
  description: {
    type: String,
    label: "Description",
    optional: true,
  },
  shipTypeID: {
    type: Number,
    label: "shipTypeID",
    autoform: {
      omit: true
    }
  },
  shipTypeName: {
    type: String,
    label: "ShipTypeName",
    autoform: {
      omit: true
    }
  },
  tips: {
    type: Array,
    label: "Tips",
    optional: true
  },
  "tips.$": {
    type: String,
    label: "Tip",
    optional: true
  },
  fittingDoctor: {
    type: Object,
    label: "Fitting Doctor",
    optional: true
  },
  "fittingDoctor.cpu": {
    type: Array,
    label: "CPU",
    optional: true
  },
  "fittingDoctor.cpu.$": {
    type: String,
    label: "Hint",
    optional: true
  },
  "fittingDoctor.powergrid": {
    type: Array,
    label: "Powergrid",
    optional: true
  },
  "fittingDoctor.powergrid.$": {
    type: String,
    label: "Hint",
    optional: true
  },
  "fittingDoctor.else": {
    type: Array,
    label: "Else",
    optional: true
  },
  "fittingDoctor.else.$": {
    type: String,
    label: "Hint",
    optional: true
  },
  stats: {
    type: Object,
    label: "Stats",
    blackbox: true,
    autoform: {
      omit: true
    }
  },
  statsLinked: {
    type: Object,
    label: "Linked Stats",
    blackbox: true,
    autoform: {
      omit: true
    }
  },
  loadout: {
    type: Object,
    label: "Loadout",
    blackbox: true,
    autoform: {
      omit: true
    }
  }
  })
);

AddFittingsSchema = new SimpleSchema({
  subtitle: {
    type: String,
    max: 100,
    label: "Subtitle",
  },
  role: {
    type: String,
    label: "Role",
    max: 50
  },
  eft: {
    type: String,
    label: "EFT",
    autoform: {
      rows: 5
    }
  }
});

// Collection2 already does schema checking
// Add custom permission rules if needed
if (Meteor.isServer) {
  Fittings.allow({
    insert : function () {
      return false;
    },
    update : function () {
      if(Meteor.user())
        return true;
      else
        return false;
    },
    remove : function () {
      if(Meteor.user())
        return true;
      else
        return false;
    }
  });

  Meteor.methods({
    'addFitting': function(document) {
      check(document, AddFittingsSchema);
      Desc.init();

      var parse = Desc.ParseEFT(document.eft);
      var fit = Desc.FromParse(parse);
      var stats = fit.getStats();
      var fleet = new Desc.Fleet();
      fleet.setSquadCommander(Desc.getStandardLinks1());
      fleet.setWingCommander(Desc.getStandardLinks2());
      fleet.addFit(fit);
      var statsLinked = fit.getStats();


      var dbEntry = {subtitle: document.subtitle, difficulty: "", 
      role: document.role, description: "" };
      _.extend(dbEntry, parse);
      dbEntry.stats = stats;
      dbEntry.statsLinked = statsLinked;
      //console.log(dbEntry);
      Fittings.insert(dbEntry);
    }
  });
}
