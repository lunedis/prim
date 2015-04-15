Meteor.publish('fittings', function () {
  return Fittings.find();
});
