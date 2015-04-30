Fittings = new Mongo.Collection('fittings');

mandatoryDescriptionSchema = new SimpleSchema({
  subtitle: {
    type: String,
    max: 100,
    label: "Subtitle",
  },
  role: {
    type: String,
    label: "Role",
    max: 50
  }
});

descriptionSchema = new SimpleSchema( {
  difficulty: {
    type: String,
    label: "Difficulty",
    allowedValues: ["", "easy", "medium", "hard"],
    optional: true
  },
  description: {
    type: String,
    label: "Description",
    optional: true,
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
});

loadoutSchema = new SimpleSchema({
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
});

eftSchema = new SimpleSchema({
 eft: {
    type: String,
    label: "EFT",
    autoform: {
      rows: 5
    }
  }
});

eftSchemaOptional = new SimpleSchema({
 eft: {
    type: String,
    label: "EFT",
    optional: true,
    autoform: {
      rows: 5
    }
  }
});

StoreFittingsSchema = new SimpleSchema(
  [mandatoryDescriptionSchema, descriptionSchema, loadoutSchema]);

AddFittingsSchema = new SimpleSchema(
  [mandatoryDescriptionSchema, eftSchema]);

UpdateFittingsSchema = new SimpleSchema(
  [mandatoryDescriptionSchema, descriptionSchema, eftSchemaOptional]);

Fittings.attachSchema(StoreFittingsSchema);



// Collection2 already does schema checking
// Add custom permission rules if needed
Meteor.startup(function() {
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

  function LoadoutAndStats(eft) {
    Desc.init();

    var parse = Desc.ParseEFT(eft);
    var fit = Desc.FromParse(parse);
    var stats = fit.getStats();
    var fleet = new Desc.Fleet();
    fleet.setSquadCommander(Desc.getStandardLinks1());
    fleet.setWingCommander(Desc.getStandardLinks2());
    fleet.addFit(fit);
    var statsLinked = fit.getStats();

    parse.stats = stats;
    parse.statsLinked = statsLinked;

    return parse;
  }

  Meteor.methods({
    'addFitting': function(document) {
      check(document, AddFittingsSchema);

      var loadoutAndStats = LoadoutAndStats(document.eft);

      var dbEntry = {subtitle: document.subtitle, difficulty: "", 
      role: document.role, description: "" };
      _.extend(dbEntry, loadoutAndStats);
      //console.log(dbEntry);
      Fittings.insert(dbEntry);
    },
    'updateFitting': function(modifier, documentID) {
      check(modifier, UpdateFittingsSchema);
      check(documentID, String);

      if(typeof modifier.$set.eft) {
        var eft = modifier.$set.eft;
        var loadoutAndStats = LoadoutAndStats(eft);

        delete modifier.$set.eft;
        _.extend(modifier.$set, loadoutAndStats);
      }

      Fittings.update(documentID, modifier);
    }
  });
});
