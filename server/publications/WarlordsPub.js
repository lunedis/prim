Meteor.publish('warlords', function () {
  return Warlords.find();
});

Meteor.publish('warlord', function(id) {
	check(id, String);
	return Warlords.find({_id: id});
});
