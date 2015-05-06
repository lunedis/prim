Meteor.startup(function() {

	function SelectText(text) {
	    var doc = document
	        , range, selection
	    ;    
	    if (doc.body.createTextRange) {
	        range = document.body.createTextRange();
	        range.moveToElementText(text);
	        range.select();
	    } else if (window.getSelection) {
	        selection = window.getSelection();        
	        range = document.createRange();
	        range.selectNodeContents(text);
	        selection.removeAllRanges();
	        selection.addRange(range);
	    }
	}

	UI.registerHelper('formatNumber', function(context, options) {
		if(context) {
			return context.toFixed(0).replace(/\d(?=(\d{3})+$)/g, '$&,');
		}
	});

	this.$('body').scrollspy({target: '#fit-nav'});

	Template['fittings'].rendered = function() {
		this.$('#fit-nav').affix({
			offset: {
				top: this.$('#fit-nav').offset().top - 20
			}
		});

		// anchor scrolling
		var hash = document.location.hash.substr(1);
		if (hash && !Template['fittings'].scrolled) {
			var scroller = function() {
				return $("html, body").stop();
			};

			Meteor.setTimeout(function() {
				var elem = $('#'+hash);
				if (elem.length) {
					scroller().scrollTop(elem.offset().top);
					// Guard against scrolling again w/ reactive changes
					Template['fittings'].scrolled = true;
				}
			}, 0);
		}
	}

	Template['fittings'].destroyed = function() {
	  delete Template['fittings'].scrolled;
	};

	Template['fittings'].helpers({
		roles: function() {
			var fittings = _.sortBy(Fittings.find({}).fetch(),'shipTypeName');
			var grouped = _.groupBy(fittings, 'role');
			var result = [];
			_.each(grouped, function(value, key, list) {
				result.push({"role": key, "fits": value});
			});
			return _.sortBy(result,'role');
		}
	});

	Template['fittings'].events({
	});

	Template['fit'].helpers({
		difficultyLabelColor: function() {
			if(this.difficulty === 'hard') {
				return 'label-danger';
			} else if(this.difficulty === 'easy') {
				return 'label-success';
			} else if(this.difficulty === 'medium') {
				return 'label-warning';
			} else {
				return 'label-info';
			}
		},
		roleLabelColor: function() {
			if(this.role === 'DPS') {
				return 'label-danger';
			} else if(this.role === 'Tackle') {
				return 'label-warning';
			} else {
				return 'label-info';
			}
		}
	});

	Template['addFitting'].helpers({
		AddFittingsSchema: function() {
			return AddFittingsSchema;
		}
	});

		
});
