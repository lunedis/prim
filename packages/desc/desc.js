function typeHasEffect(module, state, effect) {
	var boolVal = ref.alloc(ref.types.bool);
	if(libdogma.dogma_type_has_effect(module, state, effect, boolVal) === DOGMA.OK) {
		return boolVal.deref();
	} else {
		// Error
		console.log("Error");
	}
}
function getLocationEffectAttributes(context, location, key, effect) {
	var duration = ref.alloc(ref.types.double);
	var tracking = ref.alloc(ref.types.double);
	var discharge = ref.alloc(ref.types.double);
	var range = ref.alloc(ref.types.double);
	var falloff = ref.alloc(ref.types.double);
	var usageChance = ref.alloc(ref.types.double);

	var attributes = {};

	var loc = new dogma_location_t;
	loc.type = location;
	loc.index = key;

	if(libdogma.dogma_get_location_effect_attributes(
		context, loc, effect,
		duration, tracking, discharge,
		range, falloff, usageChance) === DOGMA.OK) {

		attributes.duration = duration.deref();
		attributes.tracking = tracking.deref();
		attributes.discharge = discharge.deref();
		attributes.range = range.deref();
		attributes.falloff = falloff.deref();
		attributes.usageChance = usageChance.deref();
	} else {
		console.log("Error");
	}
	return attributes;
}
function getShipAttribute(context, attribute) {
	var doubleVal = ref.alloc(ref.types.double);
	if(libdogma.dogma_get_ship_attribute(context, attribute, doubleVal) === DOGMA.OK) {
		return doubleVal.deref();
	} else {
		console.log("Error getting ship attribute");
		return 0.0;
	}
}
function getCharacterAttribute(context, attribute) {
	var doubleVal = ref.alloc(ref.types.double);
	if(libdogma.dogma_get_character_attribute(context, attribute, doubleVal) === DOGMA.OK) {
		return doubleVal.deref();
	} else {
		console.log("Error getting character attribute");
		return 0.0;
	}
}
function getModuleAttribute(context, key, attribute) {
	var doubleVal = ref.alloc(ref.types.double);
	if(libdogma.dogma_get_module_attribute(context, key, attribute, doubleVal) === DOGMA.OK) {
		return doubleVal.deref();
	} else {
		console.log("Error'getting module attribute");
		return 0.0;
	}
}
function getChargeAttribute(context, key, attribute) {
	var doubleVal = ref.alloc(ref.types.double);
	if(libdogma.dogma_get_charge_attribute(context, key, attribute, doubleVal) === DOGMA.OK) {
		return doubleVal.deref();
	} else {
		console.log("Error getting charge attribute");
		return 0.0;
	}
}
function getDroneAttribute(context, drone, attribute) {
	var doubleVal = ref.alloc(ref.types.double);
	if(libdogma.dogma_get_drone_attribute(context, drone, attribute, doubleVal) === DOGMA.OK) {
		return doubleVal.deref();
	} else {
		console.log("Error getting drone attribute");
		return 0.0;
	}
}

function assert(x) {
	if(!x) throw "assert";
}

Desc = {};
Desc.init = function() {
	libdogma.dogma_init();
}
Desc.Fit = function() {
	var contextPtrPtr = ref.alloc(dogma_context_tPtrPtr);
	assert(libdogma.dogma_init_context(contextPtrPtr) === DOGMA.OK);
	this.dogmaContext = contextPtrPtr.deref();
	this.ship = 0;
	this.modules = [];
	this.drones = [];
	this.implants = [];
}
Desc.Fit.prototype.setShip = function(s) {
	if(libdogma.dogma_set_ship(this.dogmaContext, s) === DOGMA.OK) {
		this.ship = s;
	}
}
Desc.Fit.prototype.addImplant = function (implant) {
	var keyPtr = ref.alloc(dogma_key_t);
	if(libdogma.dogma_add_implant(this.dogmaContext, implant, keyPtr) === DOGMA.OK) {
		var key = keyPtr.deref();
		var i = {"implant": implant, "key": key};
		this.implants.push(i);
		return key;
	}
}
Desc.Fit.prototype.addModule = function(module) {
	var keyPtr = ref.alloc(dogma_key_t);
	if(libdogma.dogma_add_module_s(this.dogmaContext, module, keyPtr, DOGMA.STATE_Active) === DOGMA.OK) {
		var key = keyPtr.deref();
		var m = {"key": key, "module": module, "state": DOGMA.STATE_Active};
		this.modules.push(m);
		return key;
	}
}
Desc.Fit.prototype.addModuleWithCharge = function(module, charge) {
	var keyPtr = ref.alloc(dogma_key_t);
	if(libdogma.dogma_add_module_sc(this.dogmaContext, module, keyPtr, DOGMA.STATE_Active, charge) === DOGMA.OK) {
		var key = keyPtr.deref();
		var m = {"key": key, "module": module, "charge": charge, "state": DOGMA.STATE_Active};
		this.modules.push(m);
		return key;
	}
}
Desc.Fit.prototype.addDrone = function(drone, count) {
	if(libdogma.dogma_add_drone(this.dogmaContext, drone, count) === DOGMA.OK) {
		var d = {"typeID": drone, "count": count}
		this.drones.push(d);
	}
}
Desc.Fit.prototype.getStats = function() {
	var ATTR_MISSILEDAMAGEMULTIPLIER = 212;
	var ATTR_DAMAGEMULTIPLIER = 64;
	var ATTR_EMDAMAGE = 114;
	var ATTR_EXPLOSIVEDAMAGE = 116;
	var ATTR_KINETICDAMAGE = 117;
	var ATTR_THERMALDAMAGE = 118;
	var EFFECT_TARGETATTACK = 10;
	var EFFECT_PROJECTILEFIRED = 34;
	var EFFECT_MISSILES = 101;
	// TODO: Smartbombs + RR

	stats = {};

	// Tank
	var attrIDs = [109, 110, 111, 113, 267, 268, 269, 270, 271, 272, 273, 274, 9, 263, 265, 37, 552];
	var attr = [];
	for(var i = 0; i < attrIDs.length; ++i) {
		attr[attrIDs[i]] = getShipAttribute(this.dogmaContext, attrIDs[i]);
	}
	
	var resihull = 1 / ((attr[109] + attr[110] + attr[111] + attr[113]) / 4);
	var resiarmor = 1 / ((attr[267] + attr[268] + attr[269] + attr[270]) / 4);
	var resishield = 1 / ((attr[271] + attr[272] + attr[273] + attr[274]) / 4);
	var ehphull = attr[9] * resihull;
	var ehparmor = attr[265] * resiarmor;
	var ehpshield = attr[263] * resishield;
	stats.ehp = ehphull + ehparmor + ehpshield;
	
	stats.speed = attr[37];
	stats.sigRadius = attr[552];

	stats.dps = 0;
	stats.missileDPS = 0;
	stats.turretDPS = 0;
	stats.droneDPS = 0;
	var effects = [EFFECT_MISSILES, EFFECT_PROJECTILEFIRED, EFFECT_TARGETATTACK];
	for (var i = this.modules.length - 1; i >= 0; i--) {
		var m = this.modules[i];

		for (var j = effects.length - 1; j >= 0; j--) {
			var e = effects[j];
			if(typeHasEffect(m.module, m.state, e)) {
				var effectAttributes = getLocationEffectAttributes(
					this.dogmaContext, DOGMA.LOC_Module, m.key, e);

				if(effectAttributes.duration < 1e-300)
					continue;

				if(e === EFFECT_MISSILES) {
					var multiplier = getCharacterAttribute(
						this.dogmaContext, ATTR_MISSILEDAMAGEMULTIPLIER);
					var emDamage = getChargeAttribute(
						this.dogmaContext, m.key, ATTR_EMDAMAGE);
					var explosiveDamage = getChargeAttribute(
						this.dogmaContext, m.key, ATTR_EXPLOSIVEDAMAGE);
					var kineticDamage = getChargeAttribute(
						this.dogmaContext, m.key, ATTR_KINETICDAMAGE);
					var thermalDamage = getChargeAttribute(
						this.dogmaContext, m.key, ATTR_THERMALDAMAGE);

					var dps = (multiplier * (emDamage + explosiveDamage + kineticDamage + thermalDamage)) / effectAttributes.duration;
					stats.dps += dps;
					stats.missileDPS += dps;
				} else if (e === EFFECT_TARGETATTACK || e === EFFECT_PROJECTILEFIRED) {
					var multiplier = getModuleAttribute(
						this.dogmaContext, m.key, ATTR_DAMAGEMULTIPLIER);
					var emDamage = getChargeAttribute(
						this.dogmaContext, m.key, ATTR_EMDAMAGE);
					var explosiveDamage = getChargeAttribute(
						this.dogmaContext, m.key, ATTR_EXPLOSIVEDAMAGE);
					var kineticDamage = getChargeAttribute(
						this.dogmaContext, m.key, ATTR_KINETICDAMAGE);
					var thermalDamage = getChargeAttribute(
						this.dogmaContext, m.key, ATTR_THERMALDAMAGE);
					var dps = (multiplier * (emDamage + explosiveDamage + kineticDamage + thermalDamage)) / effectAttributes.duration;
					stats.dps += dps;
					stats.turretDPS += dps;
				}
			}
			
		}
	}

	for (var i = this.drones.length - 1; i >= 0; i--) {
		var d = this.drones[i];
		var e = EFFECT_TARGETATTACK;
		if(typeHasEffect(d.typeID, DOGMA.STATE_Active, e)) {
			
			var effectAttributes = getLocationEffectAttributes(
				this.dogmaContext, DOGMA.LOC_Drone, d.typeID, e);

			var multiplier = getDroneAttribute(
				this.dogmaContext, d.typeID, ATTR_DAMAGEMULTIPLIER);
			var emDamage = getDroneAttribute(
				this.dogmaContext, d.typeID, ATTR_EMDAMAGE);
			var explosiveDamage = getDroneAttribute(
				this.dogmaContext, d.typeID, ATTR_EXPLOSIVEDAMAGE);
			var kineticDamage = getDroneAttribute(
				this.dogmaContext, d.typeID, ATTR_KINETICDAMAGE);
			var thermalDamage = getDroneAttribute(
				this.dogmaContext, d.typeID, ATTR_THERMALDAMAGE);
			var dps = ((multiplier * (emDamage + explosiveDamage + kineticDamage + thermalDamage)) / effectAttributes.duration) * d.count;
			stats.dps += dps;
			stats.droneDPS += dps;

		}
	};

	stats.dps *= 1000;
	stats.droneDPS *= 1000;
	stats.turretDPS *= 1000;
	stats.missileDPS *= 1000;

	return stats;
}

Desc.Fleet = function() {
	var fleetContextPtrPtr = ref.alloc(dogma_fleet_context_tPtrPtr);
	assert(libdogma.dogma_init_context(fleetContextPtrPtr) === DOGMA.OK);
	this.fleetContext = fleetContextPtrPtr.deref();
	this.commander = null;
	this.fits = [];
}
Desc.Fleet.prototype.addFit = function(f) {
	if(libdogma.dogma_add_squad_member(
		this.fleetContext, 0, 0, f.dogmaContext) === DOGMA.OK) {
		this.fits.push(f);
	} else {
		console.log("Error adding fit to fleet");
	}
}
Desc.Fleet.prototype.setCommander = function(f) {
	if(libdogma.dogma_add_squad_commander(
		this.fleetContext, 0, 0, f.dogmaContext) === DOGMA.OK) {
		this.commander = f;
	} else {
		console.log("Error setting fleet to commander");
	}
}

Desc.ParseEFT = function(fitting) {
	var parse = {};
	parse.drones = [];
	parse.charges = [];

	var racks = [[],[],[],[],[]];
	var currentRack = 0;
	var moduleCount = 0;

	var lines = fitting.split("\n");

	for (var i = 0; i < lines.length; i++) {
		var l = lines[i].trim();

		var headerRegex = /\[([A-Za-z ]+), (.*)\]/;
		var droneRegex = /(.*) x([0-9]+)$/;
		var moduleRegex = /([A-Za-z0-9 '\-\(\)]+)(, )?(.*)?/

		var m;

		if((l === '' || l === "\r") && moduleCount > 0) {
			currentRack++;
			moduleCount = 0;
		}

		if((m = headerRegex.exec(l)) !== null) {
			var id;
			if(id = lookupShip(m[1])) {
				parse.shipTypeID = id;
				parse.shipTypeName = m[1];
			} else {
				console.log("Error reading ship");
			}
		} else if((m = droneRegex.exec(l)) !== null) {
			var id;
			if(id = lookupDrone(m[1])) {
				parse.drones.push({typeID: id, typeName: m[1], quantity: m[2]});
			} else if(id = lookupCharge(m[1])) {
				parse.charges.push({typeID: id, typeName: m[1], quantity: m[2]});
			}
		} else if((m = moduleRegex.exec(l)) !== null) {
			var idModule;
			if(idModule = lookupModule(m[1])) {
				if(typeof m[3] != 'undefined') {
					var idCharge;
					if(idCharge = lookupCharge(m[3])) {
						racks[currentRack].push({typeID: idModule, typeName: m[1],
											chargeID: idCharge, chargeName: m[3]});
						moduleCount++;
					} else {
						console.log("Error reading module");
					}
				} else {
					racks[currentRack].push({typeID: idModule, typeName: m[1]});
					moduleCount++;
				}
			}
			
		}
	}

	parse.lows = racks[0];
	parse.mids = racks[1];
	parse.highs = racks[2];
	parse.rigs = racks[3];
	parse.subs = racks[4];
	return parse;
}

Desc.FromParse = function(parse) {
	var f = new Desc.Fit();
	f.setShip(parse.shipTypeID);

	function addModule(m) {
		if(typeof m.chargeID != 'undefined') {
			f.addModuleWithCharge(m.typeID, m.chargeID);
		} else {
			f.addModule(m.typeID);
		}
	}
	parse.highs.forEach(addModule);
	parse.mids.forEach(addModule);
	parse.lows.forEach(addModule);
	parse.rigs.forEach(addModule);
	parse.subs.forEach(addModule);
	
	parse.drones.forEach(function(d) {
		f.addDrone(d.typeID, d.quantity);
	});
	return f;
}

Desc.FromEFT = function(fitting) {
	var parse = Desc.ParseEFT(fitting);
	var f = new Desc.FromParse(parse);
	return f;
}

Desc.getSkirmishLoki = function() {
	var f = new Desc.Fit();
	f.setShip(29990);
    f.addImplant(21890);
    f.addModule(29977);
    f.addModule(30070);
    f.addModule(30161);
    f.addModule(30135);
    f.addModule(4286);
    f.addModule(4288);
    f.addModule(4290);
    f.addModule(11014);
    f.addModule(11014);
    return f;
}