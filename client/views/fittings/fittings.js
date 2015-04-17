Meteor.subscribe('fittings');

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
	fits: function() {
		return Fittings.find({});
	},
	filled: function(modules) {
		return (modules.length > 0);
	}
});

Template['fittings'].events({
	"submit .test": function() {
		try {
			var text = event.target.text.value;
			Meteor.call("dogmaTest", text);	
		} catch (e) {
			throw new Meteor.Error(500,e.reason, e.details);
		}
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