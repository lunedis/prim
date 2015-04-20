Desc = {};
Desc.init = function() {
	init();
}
Desc.Fit = function() {
	this.dogmaContext = getContext();
	this.ship = 0;
	this.modules = [];
	this.drones = [];
	this.implants = [];
}
Desc.Fit.prototype.setShip = function(s) {
	if(setShip(this.dogmaContext, s)) {
		this.ship = s;
	}
}
Desc.Fit.prototype.addImplant = function (implant) {
	var key;
	if(key = addImplant(this.dogmaContext, implant)) {
		var i = {"implant": implant, "key": key};
		this.implants.push(i);
		return key;
	} else {
		//Error
	}
}
Desc.Fit.prototype.addModule = function(module) {
	var key;
	if(key = addModule(this.dogmaContext, module, DOGMA.STATE_Active)) {
		var m = {"key": key, "module": module, "state": DOGMA.STATE_Active};
		this.modules.push(m);
		return key;
	}
}
Desc.Fit.prototype.addModuleWithCharge = function(module, charge) {
	var key;
	if(key = addModuleWithCharge(this.dogmaContext, module, DOGMA.STATE_Active, charge)) {
		var m = {"key": key, "module": module, "charge": charge, "state": DOGMA.STATE_Active};
		this.modules.push(m);
		return key;
	}
}
Desc.Fit.prototype.addDrone = function(drone, count) {
	if(addDrone(this.dogmaContext, drone, count)) {
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
	var ATTR_FLIGHTTIME = 281;
	var ATTR_MISSILEVELOCITY = 37;
	var ATTR_DRONECONTROLRANGE = 458;
	var ATTR_LOCKRANGE = 76;
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
	stats.range = {};
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

					var missileVelocity = getChargeAttribute(
						this.dogmaContext, m.key, ATTR_MISSILEVELOCITY);
					var flightTime = getChargeAttribute(
						this.dogmaContext, m.key, ATTR_FLIGHTTIME);
					var range = missileVelocity * flightTime / 1000000;
					stats.range = {missileRange: range};
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

					stats.range = {optimal: effectAttributes.range / 1000,
									falloff: effectAttributes.falloff / 1000};
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

	if(stats.droneDPS > stats.turretDPS && stats.droneDPS > stats.missileDPS) {
		var droneControlRange = getCharacterAttribute(this.dogmaContext, ATTR_DRONECONTROLRANGE) / 1000;
		stats.range = {droneControlRange: droneControlRange};
	}

	stats.dps *= 1000;
	stats.droneDPS *= 1000;
	stats.turretDPS *= 1000;
	stats.missileDPS *= 1000;

	return stats;
}

Desc.Fleet = function() {
	var fleetContextPtrPtr = ref.alloc(dogma_fleet_context_tPtrPtr);
	libdogma.dogma_init_context(fleetContextPtrPtr);
	this.fleetContext = fleetContextPtrPtr.deref();
	this.squadCommander = null;
	this.wingCommander = null;
	this.fits = [];
}
Desc.Fleet.prototype.addFit = function(f) {
	if(libdogma.dogma_add_squad_member(
		this.fleetContext, 0, 0, f.dogmaContext) === DOGMA.OK) {
		this.fits.push(f);
	} else {
		throw new Meteor.Error(500,"Error adding fit to fleet");
	}
}
Desc.Fleet.prototype.setSquadCommander = function(f) {
	if(libdogma.dogma_add_squad_commander(
		this.fleetContext, 0, 0, f.dogmaContext) === DOGMA.OK) {
		this.squadCommander = f;
	} else {
		throw new Meteor.Error(500,"Error setting fleet to commander");
	}
}
Desc.Fleet.prototype.setWingCommander = function(f) {
	if(libdogma.dogma_add_wing_commander(
		this.fleetContext, 0, f.dogmaContext) === DOGMA.OK) {
		this.wingCommander = f;
	} else {
		throw new Meteor.Error(500,"Error setting fleet to commander");
	}
}

Desc.ParseEFT = function(fitting) {
	var parse = {};
	parse.loadout = {};
	parse.loadout.drones = [];
	parse.loadout.charges = [];

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
				throw new Meteor.Error(500, "Error reading ship");
			}
		} else if((m = droneRegex.exec(l)) !== null) {
			var id;
			if(id = lookupDrone(m[1])) {
				parse.loadout.drones.push({typeID: id, typeName: m[1], quantity: m[2]});
			} else if(id = lookupCharge(m[1])) {
				parse.loadout.charges.push({typeID: id, typeName: m[1], quantity: m[2]});
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
						throw new Meteor.Error(500, "Error reading module");
					}
				} else {
					racks[currentRack].push({typeID: idModule, typeName: m[1]});
					moduleCount++;
				}
			}
			
		}
	}

	parse.loadout.lows = racks[0];
	parse.loadout.mids = racks[1];
	parse.loadout.highs = racks[2];
	parse.loadout.rigs = racks[3];
	parse.loadout.subs = racks[4];
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
	parse.loadout.highs.forEach(addModule);
	parse.loadout.mids.forEach(addModule);
	parse.loadout.lows.forEach(addModule);
	parse.loadout.rigs.forEach(addModule);
	parse.loadout.subs.forEach(addModule);
	
	parse.loadout.drones.forEach(function(d) {
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

Desc.getStandardLinks1 = function() {
	var f = new Desc.Fit();
	f.setShip(29990);
    f.addImplant(33405);
    f.addModule(29977);
    f.addModule(30070);
    f.addModule(30161);
    f.addModule(30135);
    f.addModule(4286);
    f.addModule(4288);
    f.addModule(4290);
    f.addModule(4284);
    f.addModule(11014);
    f.addModule(11014);
    f.addModule(11014);
    return f;
}

Desc.getStandardLinks2 = function() {
	var f = new Desc.Fit();
	f.setShip(29986);
    f.addImplant(33403);
    f.addModule(29967);
    f.addModule(30040);
    f.addModule(30076);
    f.addModule(30120);
    f.addModule(4264);
    f.addModule(4272);
    f.addModule(11014);
    f.addModule(11014);
    f.addModule(11014);
    return f;
}