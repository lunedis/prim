var ffi = Npm.require('ffi');
var ref = Npm.require ('ref');
var Union = Npm.require('ref-union');;
var StructType = Npm.require('ref-struct');

var dogma_array_t = ref.types.void;
var dogma_key_t = ref.types.uint32;
var dogma_typeid_t = ref.types.uint32;
var dogma_attributeid_t = ref.types.uint16;
var dogma_effectid_t = ref.types.int32;

var dogma_key_tPtr = ref.refType(dogma_key_t);

var dogma_location_type_e = ref.types.int;
var dogma_location_type_s = ref.types.int;

var DOGMA = {
	OK: 0,
	NOT_FOUND: 1,
	NOT_APPLICABLE: 2,

	LOC_Char: 0,
	LOC_Implant: 1,
	LOC_Skill: 2,
	LOC_Ship: 3,
	LOC_Module: 4,
	LOC_Charge: 5,
	LOC_Drone: 6,

	STATE_Unplugged: 0,
	STATE_Offline: 1,
	STATE_Online: 17,
	STATE_Active: 31,
	STATE_Overloaded: 63 
};
var dogma_state_t = ref.types.int;

/*var location_union = new Union({
	implant_index: dogma_key_t,
	module_index: dogma_key_t,
	skill_typeid: dogma_typeid_t,
	drone_typeid: dogma_typeid_t
});

var dogma_location_t = StructType({
	type: dogma_location_type_e,
	location: location_union
});*/

var dogma_location_t = StructType({
	type: dogma_location_type_e,
	index: dogma_key_t
});

var dogma_simple_affector_t = StructType({
	id: dogma_typeid_t,
	destid: dogma_attributeid_t,

	value: ref.types.double,
	operator: ref.types.char,

	order: ref.types.uint8,
	flags: ref.types.uint8
});
var dogma_simple_affector_tPtr = ref.refType(dogma_simple_affector_t);
var dogma_simple_affector_tPtrPtr = ref.refType(dogma_simple_affector_tPtr);

var dogma_context_t = StructType({});
var dogma_context_tPtr = ref.refType(dogma_context_t);
var dogma_context_tPtrPtr = ref.refType(dogma_context_tPtr);
var dogma_fleet_context_t = StructType({});
var dogma_fleet_context_tPtr = ref.refType(dogma_fleet_context_t);
var dogma_fleet_context_tPtrPtr = ref.refType(dogma_fleet_context_t);

var capacitor_union = new Union({
	stable_fraction: ref.types.double,
	depletion_time: ref.types.double
});
var dogma_simple_capacitor_t = new StructType({
	context: dogma_context_tPtr,
	capacity: ref.types.double,
	delta: ref.types.double,
	stable: ref.types.bool,
	info: capacitor_union
});
var dogma_simple_capacitor_tPtr = ref.refType(dogma_simple_capacitor_t);
var dogma_simple_capacitor_tPtrPtr = ref.refType(dogma_simple_capacitor_tPtr);

var doublePtr = ref.refType(ref.types.double);
var boolPtr = ref.refType(ref.types.bool);

var libdogma = ffi.Library('libdogma', {
	'dogma_init': ['int', [] ],
	'dogma_init_context': ['int', [dogma_context_tPtrPtr]],
	'dogma_free_context': ['int', [dogma_context_tPtr]],

	'dogma_add_implant': ['int', [dogma_context_tPtr,dogma_typeid_t,dogma_key_tPtr]],
	'dogma_remove_implant': ['int', [dogma_context_tPtr,dogma_key_t]],
	
	'dogma_set_default_skill_level': ['int', [dogma_context_tPtr, ref.types.uint8]],
	'dogma_set_skill_level': ['int', [dogma_context_tPtr, dogma_typeid_t, ref.types.uint8]], 
	'dogma_reset_skill_levels': ['int', [dogma_context_tPtr]], 

	'dogma_set_ship': ['int', [dogma_context_tPtr, dogma_typeid_t]],
	
	'dogma_add_module': ['int', [dogma_context_tPtr, dogma_typeid_t, dogma_key_tPtr]],
	'dogma_add_module_s': ['int', [dogma_context_tPtr, dogma_typeid_t, dogma_key_tPtr, dogma_state_t]],
	'dogma_add_module_c': ['int', [dogma_context_tPtr, dogma_typeid_t, dogma_key_tPtr, dogma_typeid_t]],
	'dogma_add_module_sc': ['int', [dogma_context_tPtr, dogma_typeid_t, dogma_key_tPtr, dogma_state_t, dogma_typeid_t]],
	'dogma_remove_module': ['int', [dogma_context_tPtr, dogma_key_t]],
	'dogma_set_module_state': ['int', [dogma_context_tPtr, dogma_key_t, dogma_state_t]],

	'dogma_add_charge': ['int', [dogma_context_tPtr, dogma_key_t, dogma_typeid_t]],
	'dogma_remove_charge': ['int', [dogma_context_tPtr, dogma_key_t]],

	'dogma_add_drone': ['int', [dogma_context_tPtr, dogma_typeid_t, ref.types.uint]],
	'dogma_remove_drone_partial': ['int', [dogma_context_tPtr, dogma_typeid_t, ref.types.uint]],
	'dogma_remove_drone': ['int', [dogma_context_tPtr, dogma_typeid_t]],

	'dogma_toggle_chance_based_effect': ['int', [dogma_context_tPtr, dogma_location_t, dogma_effectid_t, ref.types.bool]],
	'dogma_target': ['int', [dogma_context_tPtr, dogma_location_t, dogma_context_tPtr]],
	'dogma_clear_target': ['int', [dogma_context_tPtr, dogma_location_t]],

	'dogma_init_fleet_context': ['int', [dogma_fleet_context_tPtrPtr]],
	'dogma_free_fleet_context': ['int', [dogma_fleet_context_tPtr]],
	'dogma_add_fleet_commander': ['int', [dogma_fleet_context_tPtr, dogma_context_tPtr]],
	'dogma_add_wing_commander': ['int', [dogma_fleet_context_tPtr, dogma_key_t, dogma_context_tPtr]],
	'dogma_add_squad_commander': ['int', [dogma_fleet_context_tPtr, dogma_key_t, dogma_key_t, dogma_context_tPtr]],
	'dogma_add_squad_member': ['int', [dogma_fleet_context_tPtr, dogma_key_t, dogma_key_t, dogma_context_tPtr]],
	'dogma_remove_fleet_member': ['int', [dogma_fleet_context_tPtr, dogma_context_tPtr, ref.refType(ref.types.bool)]],
	'dogma_set_fleet_booster': ['int', [dogma_fleet_context_tPtr, dogma_context_tPtr]],
	'dogma_set_wing_booster': ['int', [dogma_fleet_context_tPtr, dogma_key_t, dogma_context_tPtr]],
	'dogma_set_squad_booster': ['int', [dogma_fleet_context_tPtr, dogma_key_t, dogma_key_t, dogma_context_tPtr]],

	'dogma_get_location_attribute': ['int', [dogma_context_tPtr, dogma_location_t, dogma_attributeid_t, doublePtr]],
	'dogma_get_character_attribute': ['int', [dogma_context_tPtr, dogma_attributeid_t, doublePtr]],
	'dogma_get_implant_attribute': ['int', [dogma_context_tPtr, dogma_key_t, dogma_attributeid_t, doublePtr]],
	'dogma_get_skill_attribute': ['int', [dogma_context_tPtr, dogma_typeid_t, dogma_attributeid_t, doublePtr]],
	'dogma_get_ship_attribute': ['int', [dogma_context_tPtr, dogma_attributeid_t, doublePtr]],
	'dogma_get_module_attribute': ['int', [dogma_context_tPtr, dogma_key_t, dogma_attributeid_t, doublePtr]],
	'dogma_get_charge_attribute': ['int', [dogma_context_tPtr, dogma_key_t, dogma_attributeid_t, doublePtr]],
	'dogma_get_drone_attribute': ['int', [dogma_context_tPtr, dogma_typeid_t, dogma_attributeid_t, doublePtr]],

	'dogma_get_chance_based_effect_chance': ['int', [dogma_context_tPtr, dogma_location_t, dogma_effectid_t, doublePtr]],

	'dogma_get_affectors': ['int', [dogma_context_tPtr, dogma_location_t, dogma_simple_affector_tPtrPtr, ref.refType(ref.types.size_t)]],
	'dogma_free_affector_list': ['int', [dogma_simple_affector_tPtr]],
	'dogma_type_has_effect': ['int', [dogma_typeid_t, dogma_state_t, dogma_effectid_t, boolPtr]],
	'dogma_type_has_active_effects': ['int', [dogma_typeid_t, boolPtr]],
	'dogma_type_has_overload_effects': ['int', [dogma_typeid_t, boolPtr]],
	'dogma_type_has_projectable_effects': ['int', [dogma_typeid_t, boolPtr]],
	'dogma_type_base_attribute': ['int', [dogma_typeid_t, dogma_attributeid_t, doublePtr]],
	'dogma_get_number_of_module_cycles_before_reload': ['int', [dogma_context_tPtr, dogma_key_t, ref.refType(ref.types.int)]],
	'dogma_get_capacitor_all': ['int', [dogma_context_tPtr, ref.types.bool, dogma_simple_capacitor_tPtrPtr, ref.refType(ref.types.size_t)]],
	'dogma_free_capacitor_list': ['int', [dogma_simple_capacitor_tPtr]],
	'dogma_get_capacitor': ['int', [dogma_context_tPtr, ref.types.bool, doublePtr, boolPtr, doublePtr]],
	'dogma_get_nth_type_effect_with_attributes': ['int', [dogma_typeid_t, ref.types.uint, ref.refType(dogma_effectid_t)]],
	'dogma_get_location_effect_attributes': ['int', [dogma_context_tPtr, dogma_location_t, dogma_effectid_t, doublePtr, doublePtr, doublePtr, doublePtr, doublePtr, doublePtr]]
});

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

		console.log('ok.');
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
		console.log("Error");
		return 0.0;
	}
}
function getCharacterAttribute(context, attribute) {
	var doubleVal = ref.alloc(ref.types.double);
	if(libdogma.dogma_get_character_attribute(context, attribute, doubleVal) === DOGMA.OK) {
		return doubleVal.deref();
	} else {
		console.log("Error");
		return 0.0;
	}
}
function getModuleAttribute(context, key, attribute) {
	var doubleVal = ref.alloc(ref.types.double);
	if(libdogma.dogma_get_module_attribute(context, key, attribute, doubleVal) === DOGMA.OK) {
		return doubleVal.deref();
	} else {
		console.log("Error");
		return 0.0;
	}
}
function getChargeAttribute(context, key, attribute) {
	var doubleVal = ref.alloc(ref.types.double);
	if(libdogma.dogma_get_charge_attribute(context, key, attribute, doubleVal) === DOGMA.OK) {
		return doubleVal.deref();
	} else {
		console.log("Error");
		return 0.0;
	}
}
function getDroneAttribute(context, drone, attribute) {
	var doubleVal = ref.alloc(ref.types.double);
	if(libdogma.dogma_get_drone_attribute(context, drone, attribute, doubleVal) === DOGMA.OK) {
		return doubleVal.deref();
	} else {
		console.log("Error");
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
	console.log(this.drones);
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

Desc.FromEFT = function(fitting) {
	var f = new Desc.Fit();

	var lines = fitting.split("\n");

	for (var i = 0; i < lines.length; i++) {
		var l = lines[i].trim();

		var headerRegex = /\[([A-Za-z ]+), (.*)\]/;
		var droneRegex = /(.*) x([0-9]+)$/;
		var moduleRegex = /([A-Za-z0-9 '\-\(\)]+)(, )?(.*)?/

		var m;

		if((m = headerRegex.exec(l)) !== null) {
			console.log('Ship:' + m[1] + ', Name: ' + m[2]);
		} else if((m = droneRegex.exec(l)) !== null) {
			console.log('Drone: ' + m[1] + ' times ' + m[2]);
		} else if((m = moduleRegex.exec(l)) !== null) {
			if(typeof m[3] != 'undefined') {
				console.log('Module ' + m[1] + ' with ammo ' + m[3]);
			} else {
				console.log('Module ' + m[1]);
			}
		}
	}

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
}