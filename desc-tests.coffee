TYPE_Scimitar = 11978
TYPE_PROTOTYPECLOAK = 11370
TYPE_10MNAFTERBURNERII = 12058
TYPE_50MNMWDII = 12076

roughly = (test, actual, expected, epsilon) ->
  test.equal((actual - expected) < epsilon, true)

Tinytest.add 'desc init', (test) ->
	test.equal Desc.init(), true

Tinytest.add 'desc navigation basic', (test) ->
  fit = new DescFitting()
  fit.setShip TYPE_Scimitar
  stats = fit.getNavigation()
  navigation = stats[0] # no propmod
  test.equal navigation.typeName, 'None'
  test.equal navigation.speed, 316.25
  test.equal navigation.sig, 65

Tinytest.add 'desc tank basic', (test) ->
  fit = new DescFitting()
  fit.setShip TYPE_Scimitar
  stats = fit.getTank()
  test.equal stats.resihull, 1
  roughly test, stats.resiarmor, 1.927653498, 1e-3
  roughly test, stats.resishield, 2.285855589, 1e-3
  roughly test, stats.ehphull, 1792, 1
  roughly test, stats.ehparmor, 4050, 1
  roughly test, stats.ehpshield, 4622, 1
  roughly test, stats.ehp, 10465, 1

Tinytest.add 'desc parse and missiles', (test) ->
  kestrel = """[Kestrel, MiG]
  Ballistic Control System II
  Nanofiber Internal Structure II

  5MN Y-T8 Compact Microwarpdrive
  Medium F-S9 Regolith Compact Shield Extender
  Warp Disruptor II
  Fleeting Propulsion Inhibitor I

  Light Missile Launcher II, Caldari Navy Nova Light Missile
  Light Missile Launcher II, Caldari Navy Nova Light Missile
  Light Missile Launcher II, Caldari Navy Nova Light Missile
  Light Missile Launcher II, Caldari Navy Nova Light Missile

  Small Ancillary Current Router II
  Small Anti-EM Screen Reinforcer I
  Small Core Defense Field Extender I
  Mjolnir Fury Light Missile x500
  Scourge Fury Light Missile x500
  Nova Fury Light Missile x500
  Inferno Fury Light Missile x500
  Caldari Navy Scourge Light Missile x500
  Caldari Navy Inferno Light Missile x1000
  Caldari Navy Nova Light Missile x500
  Caldari Navy Mjolnir Light Missile x500
  Nanite Repair Paste x50
  """

  parse = Desc.ParseEFT kestrel
  test.equal parse.shipTypeID, 602
  test.equal parse.shipTypeName, 'Kestrel'
  test.equal parse.loadout.mids[0].typeID, 5973
  test.equal parse.loadout.highs.length, 4
  test.equal parse.loadout.drones.length, 0
  test.equal parse.loadout.charges.length, 9

  fit = Desc.FromParse parse
  stats = fit.getDamage()

  roughly test, stats.missile.range, 63, 1
  roughly test, stats.missile.dps, 91.1, 1e-1

Tinytest.add 'desc drones', (test) ->
  VNI = """[Vexor Navy Issue, MiG]
  Damage Control II
  Energized Adaptive Nano Membrane II
  Drone Damage Amplifier II
  Drone Damage Amplifier II
  Nanofiber Internal Structure II
  Medium Ancillary Armor Repairer, Nanite Repair Paste

  Federation Navy 100MN Afterburner
  Faint Epsilon Warp Scrambler I
  Warp Disruptor II
  Medium Electrochemical Capacitor Booster I, Navy Cap Booster 800

  Small Focused Pulse Laser II, Scorch S
  Small Focused Pulse Laser II, Scorch S
  Small Unstable Power Fluctuator I
  Small Unstable Power Fluctuator I

  Medium Auxiliary Nano Pump I
  Medium Drone Speed Augmentor I
  Medium Polycarbon Engine Housing I

  Praetor II x5
  Hammerhead II x5
  Acolyte II x5

  Scorch S x2
  Conflagration S x2
  Imperial Navy Multifrequency S x2
  Nanite Repair Paste x150
  Navy Cap Booster 800 x18
  """

  fit = Desc.FromEFT VNI
  test.equal fit.drones.usedBandwith, 125
  test.equal fit.drones.active, 5
  test.equal fit.drones.inSpace.length, 1
  
  stats = fit.getDamage()
  roughly test, stats.drones.dps, 614, 1
  test.equal stats.drones.range, 60
  roughly test, stats.drones.speed, 2846, 1

Tinytest.add 'desc cloak', (test) ->
  fit = new DescFitting()

  fit.setShip TYPE_Scimitar 
  fit.addModule TYPE_PROTOTYPECLOAK

  nav = fit.getNavigation()

  roughly test, nav[0].speed, 316, 1

Tinytest.add 'desc dualprop', (test) ->
  fit = new DescFitting()

  fit.setShip TYPE_Scimitar
  fit.addModule TYPE_10MNAFTERBURNERII
  fit.addModule TYPE_50MNMWDII

  navs = fit.getNavigation()

  ab = navs[1]
  test.equal ab.typeID, TYPE_10MNAFTERBURNERII
  roughly test, ab.speed, 784.7, 1e-1

  mwd = navs[2]
  test.equal mwd.typeID, TYPE_50MNMWDII
  roughly test, mwd.speed, 2085.8, 1e-1

Tinytest.add 'desc T3D', (test) ->
  confessor = """[Confessor, shield beam]
  Heat Sink II
  Heat Sink II
  Heat Sink II
  Micro Auxiliary Power Core II
  Co-Processor II

  5MN Y-T8 Compact Microwarpdrive
  Medium F-S9 Regolith Compact Shield Extender
  Tracking Computer II, Optimal Range Script

  Small Focused Beam Laser II, Aurora S
  Small Focused Beam Laser II, Aurora S
  Small Focused Beam Laser II, Aurora S
  Small Focused Beam Laser II, Aurora S
  [Empty High slot]
  [Empty High slot]

  Small Energy Locus Coordinator II
  Small Energy Locus Coordinator II
  Small Anti-EM Screen Reinforcer II
  """

  fit = Desc.FromEFT confessor
  stats = fit.getStats()

  defense = stats.defense
  roughly test, defense.tank.ehp, 7266, 1
  roughly test, defense.navigation[1].sig, 280, 1
  roughly test, defense.navigation[1].speed, 1406, 1

  speed = stats.propulsion
  roughly test, speed.tank.ehp, 6319, 1
  roughly test, speed.navigation[1].speed, 2344, 1
  roughly test, speed.damage.turret.optimal, 46778, 1

  ss = stats.sharpshooter
  roughly test, ss.navigation[1].sig, 419, 1
  roughly test, ss.damage.turret.optimal, 77964, 1

Tinytest.add 'desc fleet', (test) ->
  arbitrator = """[Arbitrator, Med Mobile Armor]
  1600mm Rolled Tungsten Compact Plates
  Energized Adaptive Nano Membrane II
  Damage Control II
  Drone Damage Amplifier II
  Drone Damage Amplifier II

  50MN Cold-Gas Enduring Microwarpdrive
  Drone Navigation Computer II
  Drone Navigation Computer II
  Balmer Series Tracking Disruptor I

  Drone Link Augmentor II
  Light Missile Launcher II, Caldari Navy Inferno Light Missile
  Light Missile Launcher II, Caldari Navy Inferno Light Missile
  [Empty High slot]

  Medium Anti-Explosive Pump I
  Medium Trimark Armor Pump I
  Medium Trimark Armor Pump I


  Infiltrator II x5
  """

  fit = Desc.FromEFT arbitrator
  fleet = new DescFleet()
  fleet.setWingCommander Desc.getStandardLinks1()
  fleet.setSquadCommander Desc.getStandardLinks2()
  fleet.addFit fit

  stats = fit.getStats()

  roughly test, stats.tank.ehp, 41227, 1
  roughly test, stats.navigation[1].speed, 1651.3, 1e-1
  roughly test, stats.navigation[1].sig, 523, 1