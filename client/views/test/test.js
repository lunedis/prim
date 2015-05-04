Template['testDesc'].events({
	'submit #test': function(e) {
		e.preventDefault();
		var eft = e.target.eft.value;
		
		Meteor.call('testDesc', eft, function(error,result){
		    if(error){
		        console.log(error.reason);
		    }
		    else{
		        console.log(result);
		    }
		});
	}
});