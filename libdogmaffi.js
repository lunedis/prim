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

DOGMA = {
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

libdogma = ffi.Library('libdogma', {
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

init = function() {
	libdogma.dogma_init();
}

function assert(x) {
	if(!x) throw "assert";
}

getContext = function() {
	var contextPtrPtr = ref.alloc(dogma_context_tPtrPtr);
	assert(libdogma.dogma_init_context(contextPtrPtr) === DOGMA.OK);
	return contextPtrPtr.deref();	
}

setShip = function(context, ship) {
	return (libdogma.dogma_set_ship(context, ship) === DOGMA.OK);
}

function genericAdd(f) {
	var keyPtr = ref.alloc(dogma_key_t);

	var args = Array.prototype.slice.call(arguments,1);

	for(var i = 0; i < args.length; i++) {
		if(args[i] === "Key") {
			args[i] = keyPtr;
		}
	}

	if(f.apply(null, args) === DOGMA.OK) {
		return keyPtr.deref();
	} else {
		return false;
	}
}

addImplant = function(context, implant) {
	return genericAdd(libdogma.dogma_add_implant, context, implant, "Key");
}

addModule = function(context, module, state) {
	return genericAdd(libdogma.dogma_add_module_s, context, module, "Key", state);
}

addModuleWithCharge = function(context, module, state, charge) {
	return genericAdd(libdogma.dogma_add_module_sc, context, module, "Key", state, charge);
}

addDrone = function(context, drone, count) {
	return (libdogma.add_drone(context, drone, count) === DOGMA.OK);
}

typeHasEffect = function(module, state, effect) {
	var boolVal = ref.alloc(ref.types.bool);
	if(libdogma.dogma_type_has_effect(module, state, effect, boolVal) === DOGMA.OK) {
		return boolVal.deref();
	} else {
		// Error
		console.log("Error");
	}
}
getLocationEffectAttributes = function(context, location, key, effect) {
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
getShipAttribute = function(context, attribute) {
	var doubleVal = ref.alloc(ref.types.double);
	if(libdogma.dogma_get_ship_attribute(context, attribute, doubleVal) === DOGMA.OK) {
		return doubleVal.deref();
	} else {
		console.log("Error getting ship attribute");
		return 0.0;
	}
}
getCharacterAttribute = function(context, attribute) {
	var doubleVal = ref.alloc(ref.types.double);
	if(libdogma.dogma_get_character_attribute(context, attribute, doubleVal) === DOGMA.OK) {
		return doubleVal.deref();
	} else {
		console.log("Error getting character attribute");
		return 0.0;
	}
}
getModuleAttribute = function(context, key, attribute) {
	var doubleVal = ref.alloc(ref.types.double);
	if(libdogma.dogma_get_module_attribute(context, key, attribute, doubleVal) === DOGMA.OK) {
		return doubleVal.deref();
	} else {
		console.log("Error'getting module attribute");
		return 0.0;
	}
}
getChargeAttribute = function(context, key, attribute) {
	var doubleVal = ref.alloc(ref.types.double);
	if(libdogma.dogma_get_charge_attribute(context, key, attribute, doubleVal) === DOGMA.OK) {
		return doubleVal.deref();
	} else {
		console.log("Error getting charge attribute");
		return 0.0;
	}
}
getDroneAttribute = function(context, drone, attribute) {
	var doubleVal = ref.alloc(ref.types.double);
	if(libdogma.dogma_get_drone_attribute(context, drone, attribute, doubleVal) === DOGMA.OK) {
		return doubleVal.deref();
	} else {
		console.log("Error getting drone attribute");
		return 0.0;
	}
}

getFleetContext = function() {
	var fleetContextPtrPtr = ref.alloc(dogma_fleet_context_tPtrPtr);
	assert(libdogma.dogma_init_context(fleetContextPtrPtr) === DOGMA.OK);
	return fleetContextPtrPtr.deref();
}