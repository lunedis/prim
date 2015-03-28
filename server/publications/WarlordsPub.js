Meteor.publish('warlords', function () {
  return Warlords.find();
});
