TYPE_Scimitar = 11978;

roughly = (test, actual, expected, epsilon) ->
  test.equal((actual - expected) < epsilon, true)

Tinytest.add 'desc init', (test) ->
	test.equal Desc.init(), true

Tinytest.add 'desc navigation basic', (test) ->
  fit = new DescFitting()
  fit.setShip TYPE_Scimitar
  stats = fit.getNavigation()
  test.equal stats.speed, 316.25
  test.equal stats.sig, 65

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

Tinytest.add 'desc parse', (test) ->
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

