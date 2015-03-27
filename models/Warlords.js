Warlords = new Mongo.Collection('Warlords');

Warlords.attachSchema(
    new SimpleSchema({
    characterID: {
      type: String
    },
    characterName: {
      type: String
    },
    joinDate: {
      type: Date
    },
    comment: {
      type: String
    }
   })
);

// Collection2 already does schema checking
// Add custom permission rules if needed
if (Meteor.isServer) {
  Warlords.allow({
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
}
