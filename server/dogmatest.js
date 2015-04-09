Meteor.methods({
	'dogmaTest': function() {
		Desc.init();
		var f = new Desc.Fit();
		f.setShip(11381);
		f.addModule(5837);
		f.addModule(31722);
		console.log('EHP: ' + f.getEHP());
	}
});
