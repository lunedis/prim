InvTypes = new Meteor.Collection("invtypes");

InvTypes.deny({
  insert: function(){ return true; },
  update: function(){ return true; },
  remove: function(){ return true; }
});