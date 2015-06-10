TYPE_125mmGatlingAutoCannonII = 2873;
TYPE_BarrageS = 12625;
TYPE_CapBooster25 = 263;
TYPE_Drones = 3436;
TYPE_Rifter = 587;
TYPE_Scimitar = 11978;
TYPE_SmallAncillaryShieldBooster = 32774;
TYPE_SnakeOmega = 19556;
TYPE_StasisWebifierI = 526;
TYPE_StrongBluePillBooster = 10156;
TYPE_WarriorI = 2486;
ATT_CapacitorBonus = 67;
ATT_CapacitorNeed = 6;
ATT_DroneBandwidthUsed = 1272;
ATT_Implantness = 331;
ATT_LauncherSlotsLeft = 101;
ATT_MaxActiveDroneBonus = 353;
ATT_MaxActiveDrones = 352;
ATT_MaxLockedTargets = 192;
ATT_SkillLevel = 280;
EFFECT_BoosterShieldCapacityPenalty = 2737;
EFFECT_HiPower = 12;

Tinytest.add 'libdogma init', (test) ->
  test.equal init(), true

Tinytest.add 'libdogma character attribute', (test) ->
  c = new DogmaContext()
  test.equal c.getCharacterAttribute(ATT_MaxActiveDrones), 5

Tinytest.add 'libdogma implant add', (test) ->
  c = new DogmaContext()
  key = c.addImplant TYPE_SnakeOmega
  test.equal c.getLocationAttribute(DOGMA.LOC_Implant, key, ATT_Implantness), 6
  test.equal c.getImplantAttribute(key, ATT_Implantness), 6
  test.equal c.removeImplant(key), true
  test.equal c.removeImplant(key), false

Tinytest.add 'libdogma skills', (test) ->
  c = new DogmaContext()
  test.equal c.setDefaultSkillLevel(3), true
  test.equal c.getCharacterAttribute(ATT_MaxActiveDrones), 3
  
  test.equal c.setSkillLevel(TYPE_Drones, 0), true
  test.equal c.getCharacterAttribute(ATT_MaxActiveDrones), 0

  test.equal c.getSkillAttribute(TYPE_Drones, ATT_SkillLevel), 0

  test.equal c.resetSkillLevels(), true
  test.equal c.getCharacterAttribute(ATT_MaxActiveDrones), 3

  test.equal c.getLocationAttribute(DOGMA.LOC_Skill, TYPE_Drones, ATT_MaxActiveDroneBonus), 3
  test.equal c.setDefaultSkillLevel(5), true
  test.equal c.getCharacterAttribute(ATT_MaxActiveDrones), 5

Tinytest.add 'libdogma ships', (test) ->
  c = new DogmaContext()
  test.equal c.setShip(TYPE_Rifter), true
  test.equal c.getShipAttribute(ATT_MaxLockedTargets), 4
  test.equal c.setShip(TYPE_Scimitar), true
  test.equal c.getLocationAttribute(DOGMA.LOC_Ship, 0, ATT_MaxLockedTargets), 10

Tinytest.add 'libdogma modules and charges', (test) ->
  c = new DogmaContext()
  test.equal c.setShip(TYPE_Scimitar), true
  key = c.addModule TYPE_SmallAncillaryShieldBooster 
  test.equal c.setModuleState(key, DOGMA.STATE_Overloaded), true
  test.equal c.getModuleAttribute(key, ATT_CapacitorNeed) > 0.0, true
  test.equal c.removeModule(key), true

  key = c.addModuleS TYPE_SmallAncillaryShieldBooster, DOGMA.STATE_Active
  test.equal c.removeModule(key), true

  key = c.addModuleC TYPE_SmallAncillaryShieldBooster, TYPE_CapBooster25
  test.equal c.getModuleAttribute(key, ATT_CapacitorNeed), 0
  test.equal c.removeModule(key), true

  key = c.addModuleSC TYPE_SmallAncillaryShieldBooster, DOGMA.STATE_Active, TYPE_CapBooster25
  test.equal c.getModuleAttribute(key, ATT_CapacitorNeed), 0
  test.equal c.removeCharge(key), true
  test.equal c.getModuleAttribute(key, ATT_CapacitorNeed) > 0.0, true
  test.equal c.addCharge(key, TYPE_CapBooster25), true
  test.equal c.getModuleAttribute(key, ATT_CapacitorNeed), 0
  test.equal c.getChargeAttribute(key, ATT_CapacitorBonus), 25
  test.equal c.removeCharge(key), true
  test.equal c.removeCharge(key), false
  test.equal c.removeModule(key), true

Tinytest.add 'libdogma drones', (test) ->
  c = new DogmaContext()
  test.equal c.addDrone(TYPE_WarriorI, 2), true
  test.equal c.getDroneAttribute(TYPE_WarriorI, ATT_DroneBandwidthUsed), 5

  test.equal c.removeDrone(TYPE_WarriorI, 1), true
  test.equal c.getLocationAttribute(DOGMA.LOC_Drone, TYPE_WarriorI, ATT_DroneBandwidthUsed), 5

  test.equal c.removeDrone(TYPE_WarriorI, 1), true

Tinytest.add 'libdogma boosters', (test) ->
  c = new DogmaContext()
  test.equal c.setShip(TYPE_Scimitar), true
  key = c.addImplant(TYPE_StrongBluePillBooster)
  test.equal c.toggleChanceBasedEffect(DOGMA.LOC_Implant, key, EFFECT_BoosterShieldCapacityPenalty), true
  test.equal c.getChanceBasedEffectChance(DOGMA.LOC_Implant, key, EFFECT_BoosterShieldCapacityPenalty), 0.3
  test.equal c.removeImplant(key), true
  test.equal c.toggleChanceBasedEffect(DOGMA.LOC_Implant, key, EFFECT_BoosterShieldCapacityPenalty), false

Tinytest.add 'libdogma targets', (test) ->
  c = new DogmaContext()
  test.equal c.setShip(TYPE_Rifter), true
  key = c.addModule(TYPE_StasisWebifierI)
  test.equal c.target(DOGMA.LOC_Module, key), true
  test.equal c.clear_target(DOGMA.LOC_Module, key), true
  test.equal c.removeModule(key), true

Tinytest.add 'libdogma fleet and freeing', (test) ->
  c = new DogmaContext()
  test.equal c.setShip(TYPE_Rifter), true

  f = new FleetContext()
  test.equal f.addFleetCommander(c), true
  test.equal f.addWingCommander(0, c), true
  test.equal f.addSquadCommander( 0, 0, c), true
  test.equal f.addSquadMember(0, 0, c), true

  test.equal f.removeFleetMember(c), true
  test.equal f.removeFleetMember(c), false
  test.equal f.addSquadMember(0, 0, c), true

  test.equal c.free(), true
  test.equal f.free(), true