ffi = Npm.require 'ffi'
@ref = Npm.require 'ref'
Union = Npm.require 'ref-union'
StructType = Npm.require 'ref-struct'

dogma_array_t = ref.types.void
dogma_key_t = ref.types.ulong
dogma_typeid_t = ref.types.uint32
dogma_attributeid_t = ref.types.uint16
dogma_effectid_t = ref.types.int32
dogma_key_tPtr = ref.refType dogma_key_t
dogma_location_type_e = ref.types.int
dogma_location_type_s = ref.types.int

@DOGMA =
  OK: 0
  NOT_FOUND: 1
  NOT_APPLICABLE: 2
  LOC_Char: 0
  LOC_Implant: 1
  LOC_Skill: 2
  LOC_Ship: 3
  LOC_Module: 4
  LOC_Charge: 5
  LOC_Drone: 6
  STATE_Unplugged: 0
  STATE_Offline: 1
  STATE_Online: 17
  STATE_Active: 31
  STATE_Overloaded: 63

dogma_state_t = ref.types.int

@dogma_location_t = StructType(
  type: dogma_location_type_e
  index: dogma_key_t)

dogma_simple_affector_t = StructType(
  id: dogma_typeid_t
  destid: dogma_attributeid_t
  value: ref.types.double
  operator: ref.types.char
  order: ref.types.uint8
  flags: ref.types.uint8)

dogma_simple_affector_tPtr = ref.refType dogma_simple_affector_t
dogma_simple_affector_tPtrPtr = ref.refType dogma_simple_affector_tPtr
dogma_context_t = StructType({})
dogma_context_tPtr = ref.refType dogma_context_t
dogma_context_tPtrPtr = ref.refType dogma_context_tPtr
dogma_fleet_context_t = StructType({})
dogma_fleet_context_tPtr = ref.refType dogma_fleet_context_t
dogma_fleet_context_tPtrPtr = ref.refType dogma_fleet_context_t
capacitor_union = new Union(
  stable_fraction: ref.types.double
  depletion_time: ref.types.double)

dogma_simple_capacitor_t = new StructType(
  context: dogma_context_tPtr
  capacity: ref.types.double
  delta: ref.types.double
  stable: ref.types.bool
  info: capacitor_union)

dogma_simple_capacitor_tPtr = ref.refType dogma_simple_capacitor_t
dogma_simple_capacitor_tPtrPtr = ref.refType dogma_simple_capacitor_tPtr
doublePtr = ref.refType ref.types.double
boolPtr = ref.refType ref.types.bool

@libdogma = ffi.Library 'libdogma', {
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
}

@init = ->
  libdogma.dogma_init() == DOGMA.OK

assert = (x) ->
  !x ? throw 'assert'

# Generalize AddSomethingToShip functions.
# They all require various parameters, with one being the key variable that is getting filled and returned.
# This function takes a libdogma function (f) and multiple parameters, where it replaces the String "Key" with the keyPtr.
genericAdd = (f, args...) ->
  keyPtr = ref.alloc dogma_key_t
  index = args.indexOf 'Key'
  if ~index 
    args[index] = keyPtr

  if f.apply(null, args) == DOGMA.OK
    keyPtr.deref()
  else
    console.log('error in generic code')
    false

@typeHasEffect = (module, state, effect) ->
  boolVal = ref.alloc ref.types.bool
  if libdogma.dogma_type_has_effect(module, state, effect, boolVal) == DOGMA.OK
    boolVal.deref()
  else
    console.log 'Error'
    false

getGenericAttribute = (f, args...) ->
  doubleVal = ref.alloc ref.types.double

  args.push(doubleVal)

  if f.apply(null, args) == DOGMA.OK
    doubleVal.deref()
  else
    false

class @DogmaContext
  constructor: ->
    contextPtrPtr = ref.alloc dogma_context_tPtrPtr
    assert(libdogma.dogma_init_context(contextPtrPtr) == DOGMA.OK)
    @internalContext = contextPtrPtr.deref()

  setDefaultSkillLevel: (level) ->
    libdogma.dogma_set_default_skill_level(@internalContext, level) == DOGMA.OK

  setSkillLevel: (typeID, level) ->
    libdogma.dogma_set_skill_level(@internalContext, typeID, level) == DOGMA.OK

  resetSkillLevels: ->
    libdogma.dogma_reset_skill_levels(@internalContext) == DOGMA.OK

  setShip: (ship) ->
    libdogma.dogma_set_ship(@internalContext, ship) == DOGMA.OK

  #call genericAdd with different functions and correct parameter ordering
  addImplant: (implant) ->
    genericAdd libdogma.dogma_add_implant, @internalContext, implant, 'Key'

  addModule: (module) ->
    genericAdd libdogma.dogma_add_module, @internalContext, module, 'Key'

  addModuleS: (module, state) ->
    genericAdd libdogma.dogma_add_module_s, @internalContext, module, 'Key', state

  addModuleC: (module, charge) ->
    genericAdd libdogma.dogma_add_module_c, @internalContext, module, 'Key', charge

  addModuleSC: (module, state, charge) ->
    genericAdd libdogma.dogma_add_module_sc, @internalContext, module, 'Key', state, charge

  addCharge: (key, charge) ->
    libdogma.dogma_add_charge(@internalContext, key, charge) == DOGMA.OK

  addDrone: (drone, count) ->
    libdogma.dogma_add_drone(@internalContext, drone, count) == DOGMA.OK

  removeImplant: (key) ->
    libdogma.dogma_remove_implant(@internalContext, key) == DOGMA.OK

  removeDrone: (drone, count) ->
    libdogma.dogma_remove_drone_partial(@internalContext, drone, count) == DOGMA.OK

  removeModule: (key) ->
    libdogma.dogma_remove_module(@internalContext, key) == DOGMA.OK

  removeCharge: (key) ->
    libdogma.dogma_remove_charge(@internalContext, key) == DOGMA.OK

  setModuleState: (key, state) ->
    libdogma.dogma_set_module_state(@internalContext, key, state) == DOGMA.OK

  getLocationEffectAttributes: (location, key, effect) ->
    duration = ref.alloc ref.types.double
    tracking = ref.alloc ref.types.double
    discharge = ref.alloc ref.types.double
    range = ref.alloc ref.types.double
    falloff = ref.alloc ref.types.double
    usageChance = ref.alloc ref.types.double
    attributes = {}
    loc = new dogma_location_t
    loc.type = location
    loc.index = key
    if libdogma.dogma_get_location_effect_attributes(@internalContext, loc, effect, duration, tracking, discharge, range, falloff, usageChance) == DOGMA.OK
      attributes.duration = duration.deref()
      attributes.tracking = tracking.deref()
      attributes.discharge = discharge.deref()
      attributes.range = range.deref()
      attributes.falloff = falloff.deref()
      attributes.usageChance = usageChance.deref()
    else
      console.log 'Error'
    attributes

  getLocationAttribute: (locationType, locationIndex, attribute) ->
    loc = new dogma_location_t
    loc.type = locationType
    loc.index = locationIndex
    getGenericAttribute libdogma.dogma_get_location_attribute, @internalContext, loc, attribute

  getShipAttribute: (attribute) ->
    getGenericAttribute libdogma.dogma_get_ship_attribute, @internalContext, attribute

  getSkillAttribute: (typeID, attribute) ->
    getGenericAttribute libdogma.dogma_get_skill_attribute, @internalContext, typeID, attribute

  getCharacterAttribute: (attribute) ->
    getGenericAttribute libdogma.dogma_get_character_attribute, @internalContext, attribute

  getModuleAttribute: (key, attribute) ->
    getGenericAttribute libdogma.dogma_get_module_attribute, @internalContext, key, attribute

  getChargeAttribute: (key, attribute) ->
    getGenericAttribute libdogma.dogma_get_charge_attribute, @internalContext, key, attribute

  getDroneAttribute: (drone, attribute) ->
    getGenericAttribute libdogma.dogma_get_drone_attribute, @internalContext, drone, attribute

  getImplantAttribute: (key, attribute) ->
    getGenericAttribute libdogma.dogma_get_implant_attribute, @internalContext, key, attribute

  free: ->
    libdogma.dogma_free_context(@internalContext) == DOGMA.OK

class @FleetContext
  constructor: ->
    fleetContextPtrPtr = ref.alloc dogma_fleet_context_tPtrPtr
    assert(libdogma.dogma_init_fleet_context(fleetContextPtrPtr) == DOGMA.OK)
    @internalContext = fleetContextPtrPtr.deref()

  addSquadMember: (squad, wing, fit) ->
    libdogma.dogma_add_squad_member(
      @internalContext, squad, wing, fit.internalContext) == DOGMA.OK

  addSquadCommander: (squad, wing, fit) ->
    libdogma.dogma_add_squad_commander(
      @internalContext, squad, wing, fit.internalContext) == DOGMA.OK

  addWingCommander: (wing, fit) ->
    libdogma.dogma_add_wing_commander(
      @internalContext, wing, fit.internalContext) == DOGMA.OK

  addFleetCommander: (fit) ->
    libdogma.dogma_add_fleet_commander(
      @internalContext, fit.internalContext) == DOGMA.OK

  removeFleetMember: (fit) ->
    boolVal = ref.alloc ref.types.bool
    if libdogma.dogma_remove_fleet_member(@internalContext, fit.internalContext, boolVal) == DOGMA.OK
      boolVal.deref()
    else
      false

  setFleetBooster: (fit) ->
    libdogma.dogma_set_fleet_booster(@internalContext, fit?.internalContext) == DOGMA.OK

  setWingBooster: (wing, fit) ->
    libdogma.dogma_set_fleet_booster(@internalContext, wing, fit?.internalContext) == DOGMA.OK

  setSquadBooster: (wing, squad, fit) ->
    libdogma.dogma_set_fleet_booster(@internalContext, wing, squad, fit?.internalContext) == DOGMA.OK

  free: ->
    libdogma.dogma_free_fleet_context(@internalContext) == DOGMA.OK