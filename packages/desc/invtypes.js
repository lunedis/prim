InvTypes = new Meteor.Collection("invtypes");

InvTypes.deny({
  insert: function(){ return true; },
  update: function(){ return true; },
  remove: function(){ return true; }
});

function lookup(typeName) {
	var type = InvTypes.findOne({typeName: typeName});
	return type;
}

function lookupCategory(typeName, check) {
	var type = lookup(typeName);
	if(typeof type != 'undefined' && check(type.categoryName)) {
		return type.typeID;
	} else {
		return false;
	}
}

lookupShip = function(typeName) {
	return lookupCategory(typeName, function(categoryName) {
		return categoryName === "Ship";
	});
}

lookupDrone = function(typeName) {
	return lookupCategory(typeName, function(categoryName) {
		return categoryName === "Drone";
	});
}

lookupCharge = function(typeName) {
	return lookupCategory(typeName, function(categoryName) {
		return categoryName === "Charge";
	});
}


lookupModule = function(typeName) {
	return lookupCategory(typeName, function(categoryName) {
		return categoryName === "Module" 
			|| categoryName === "Subsystem";
	});
}