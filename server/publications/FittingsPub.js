Meteor.publish('fittings', function () {
  return Fittings.find();
});

Meteor.publish('fit', function(id) {
	check(id, String);
	return Fittings.find({_id: id});
});
