Template['navigation'].helpers({
	navigation: function() {
		return _.sortBy(navigation,'order');
	}
});