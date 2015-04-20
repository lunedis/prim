UI.registerHelper('formatNumber', function(context, options) {
	if(context) {
		return context.toFixed(0).replace(/\d(?=(\d{3})+$)/g, '$&,');
	}
});

Meteor.startup(function() {
	this.$('body').scrollspy({target: '#fit-nav'});
});

Template['fittings'].rendered = function() {
	this.$('#fit-nav').affix({
		offset: {
			top: this.$('#fit-nav').offset().top - 20
		}
	});
}

Template['fittings'].helpers({
	roles: function() {
		var fittings = _.sortBy(Fittings.find({}).fetch(),'shipTypeName');
		var grouped = _.groupBy(fittings, 'role');
		var result = [];
		_.each(grouped, function(value, key, list) {
			result.push({"role": key, "fits": value});
		});
		return _.sortBy(result,'role');
	},
	filled: function(modules) {
		return (modules.length > 0);
	}
});

Template['fittings'].events({
	"submit .test": function() {
		try {
			var text = event.target.text.value;
			Meteor.call("addFitting", text);
		} catch (e) {
			throw new Meteor.Error(500,e.reason, e.details);
		}
		return false;
	}
});

Template['fit'].helpers({
	labelColor: function() {
		if(this.difficulty === 'hard') {
			return 'label-danger';
		} else if(this.difficulty === 'easy') {
			return 'label-success';
		} else if(this.difficulty === 'medium') {
			return 'label-warning';
		} else {
			return 'label-info';
		}
	}
})

Template['rackSmall'].helpers({
	filled: function(modules) {
		return (modules.length > 0);
	}
});