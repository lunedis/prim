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
}
