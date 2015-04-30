Meteor.startup(function() {
	Template['warlords-edit'].helpers({
	});

	Template['warlords-edit'].events({
		'click #delete': function(e) {
			e.preventDefault();

			if(confirm("Are you sure?")) {
				Router.go('warlords');
				Warlords.remove(this._id);
			}
		}
	});

	AutoForm.hooks({
		editWarlordForm: {	
			onSuccess: function(operation, warlord) {
				Router.go('warlords');
			}
		}
	});

});
