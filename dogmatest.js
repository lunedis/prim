var ffi = require('ffi');
var ref = require ('ref');
var Union = require('ref-union');;
var StructType = require('ref-struct');

var dogma_array_t = ref.types.void;
var dogma_key_t = ref.types.void;
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
	LOC_Char: 1,
	LOC_Implant: 2,
	LOC_Skill: 3,
	LOC_Ship: 4,
	LOC_Module: 5,
	LOC_Charge: 6,
	LOC_Drone: 7,

	STATE_Unplugged: 0,
	STATE_Offline: 1,
	STATE_Online: 17,
	STATE_Active: 31,
	STATE_Overloaded: 63 
};
var dogma_state_t = ref.types.int;

var location_union = new Union({
	implant_index: dogma_key_t,
	module_index: dogma_key_t,
	skill_typeid: dogma_typeid_t,
	drone_typeid: dogma_typeid_t
});

var dogma_location_t = StructType({
	type: dogma_location_type_e,
	location: location_union
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

function assert(x) {
	if(!x) throw "assert";
}

assert(libdogma.dogma_init() == DOGMA.OK);
var contextPtrPtr = ref.alloc(dogma_context_tPtrPtr);
assert(libdogma.dogma_init_context(contextPtrPtr) == DOGMA.OK);
var context = contextPtrPtr.deref();

assert(libdogma.dogma_set_ship(context, TYPE_Rifter) == DOGMA.OK);

libdogma.dogma_set_default_skill_level(context, 5);
libdogma.dogma_set_ship(context, 11381);
var keyPtr = ref.alloc(dogma_key_tPtr);
libdogma.dogma_add_module_s(context, 5837, keyPtr, DOGMA.STATE_Active);
libdogma.dogma_add_module_s(context, 31722, keyPtr, DOGMA.STATE_Active);
var doublePtr = ref.alloc(ref.types.double);
libdogma.dogma_get_ship_attribute(context, 271, doublePtr);
var value = 1.0 - doublePtr.deref();
libdogma.dogma_free_context(context);
console.log('Value: ' + value);
