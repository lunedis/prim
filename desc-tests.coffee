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
  test.equal Desc.init(), DOGMA.OK

Tinytest.add 'libdogma character attribute', (test) ->
  c = new DogmaContext()
  test.equal c.getCharacterAttribute(ATT_MaxActiveDrones), 5

Tinytest.add 'libdogma implant add', (test) ->
  c = new DogmaContext()
  key = c.addImplant TYPE_SnakeOmega
  doubleVal = ref.alloc ref.types.double
  loc = new dogma_location_t
  loc.type = DOGMA.LOC_Implant
  loc.index = key
  test.equal libdogma.dogma_get_location_attribute(c.internalContext, loc, ATT_Implantness, doubleVal), DOGMA.OK
  double = doubleVal.deref()
  test.equal double, 6

  test.equal libdogma.dogma_remove_implant(c.internalContext, key), DOGMA.OK
  test.equal libdogma.dogma_remove_implant(c.internalContext, key), DOGMA.NOT_FOUND

Tinytest.add 'libdogma skill levels', (test) ->
  c = new DogmaContext()
  c.setDefaultSkillLevel 3
  test.equal c.getCharacterAttribute(ATT_MaxActiveDrones), 3
  # TODO set skill level
