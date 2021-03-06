Meteor.startup(function() {

	Template['fittings-edit'].helpers({
		UpdateFittingsSchema: function() {
			return UpdateFittingsSchema;
		}
	});

	Template['fittings-edit'].events({
		'click #delete': function(e) {
			e.preventDefault();

			if(confirm("Are you sure?")) {
				Router.go('fittings');
				Fittings.remove(this._id);
			}
		}
	});

	AutoForm.hooks({
		editFittingForm: {	
			onSuccess: function(operation, fit) {
				Router.go('fittings');
			}
		}
	});

});
