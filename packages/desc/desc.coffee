Desc = {};
Desc.init = ->
  init()

class DescFitting
  constructor: ->
    @dogmaContext = new DogmaContext
    @dogmaContext.setDefaultSkillLevel 5
    @ship = 0
    @modules = []
    @drones = 
      usedBandwith: 0
      active: 0
      inSpace: []
      inBay: []
    @implants = []
    @propmods = [{typeName: 'None', typeID: 'None', key: -1}]

  # General
  ATTR_EMDAMAGE: 114
  ATTR_EXPLOSIVEDAMAGE: 116
  ATTR_KINETICDAMAGE: 117
  ATTR_THERMALDAMAGE: 118
  ATTR_LOCKRANGE: 76
  ATTR_MAXVELOCITY: 37
  ATTR_SIGNATURERADIUS: 552
  # Missiles
  ATTR_MISSILEDAMAGEMULTIPLIER: 212
  ATTR_FLIGHTTIME: 281
  ATTR_MISSILEVELOCITY: 37
  ATTR_AOEVELOCITY: 653
  ATTR_AOEClOUDSIZE: 654
  ATTR_AOEDAMAGEREDUCTIONFACTOR: 1353
  ATTR_AOEDAMAGEREDUCTIONSENSITIVITY: 1354
  # Turrets
  ATTR_DAMAGEMULTIPLIER: 64
  ATTR_OPTIMALSIGRADIUS: 620
  # Drones
  ATTR_DRONECONTROLRANGE: 458
  ATTR_DRONEBANDWITH: 1271
  ATTR_DRONEBANDWITHUSED: 1272
  ATTR_MAXACTIVEDRONES: 352
  ATTR_REQUIREDSKILL1: 182
  TYPE_SENTRYDRONEINTERFACING: 23594
  # RR
  ATTR_ARMORRRAMOUNT: 84
  ATTR_SHIELDBONUS: 68
  # Effects
  EFFECT_TARGETATTACK: 10
  EFFECT_PROJECTILEFIRED: 34
  EFFECT_MISSILES: 101
  EFFECT_SMARTBOMB: 38
  EFFECT_ARMORRR: 592
  EFFECT_SHIELDTRANSFER: 18

  EFFECT_SPEEDBOOST: 710 # for propmods
  EFFECT_SPEEDBOOSTSIGMASS: 1254 # for mwd
  EFFECT_MJD: 4921 # for mjd

  # TODO: better way?
  MODES:
    34317: # Confessor
      defense: 34319
      propulsion: 34323
      sharpshooter: 34321
    34562: # Svipul
      defense: 34564
      propulsion: 34566
      sharpshooter: 34570
    34828: # Jackdaw
      defense: 35676
      propulsion: 35677
      sharpshooter: 35678 

  setShip: (s) ->
    @ship = s if @dogmaContext.setShip(s)

  addImplant: (implant) ->
    if (key = @dogmaContext.addImplant implant) != false
      i = {implant: implant, key: key}
      @implants.push(i);
      return key
    else
      console.log "Error adding implant #{implant}"

  addModule: (module) ->
    if (key = @dogmaContext.addModuleS module, DOGMA.STATE_Active) != false
      m = {key: key, module: module, state: DOGMA.STATE_Active}
      @modules.push(m)

      # propmod handling 
      if typeHasEffect(module, DOGMA.STATE_Active, @EFFECT_SPEEDBOOST) or typeHasEffect(module, DOGMA.STATE_Active, @EFFECT_MJD)
        @dogmaContext.setModuleState key, DOGMA.STATE_Online
        typeName = lookupName module
        prop = {typeID: module, typeName: typeName, key: key}
        @propmods.push prop

      return key
    else
      console.log "Error adding module #{module}"

  addModuleWithCharge: (module, charge) ->
    if (key = @dogmaContext.addModuleSC module, DOGMA.STATE_Active, charge) != false
      m = {key: key, module: module, charge: charge, state: DOGMA.STATE_Active}
      @modules.push(m)
      key
    else
      console.log('Error adding module #{module} with charge #{charge}');

  addDrone: (drone, count) ->
    return if count == 0

    @dogmaContext.addDrone drone, 1
    bandwith = @dogmaContext.getDroneAttribute drone, @ATTR_DRONEBANDWITHUSED
    @dogmaContext.removeDrone drone, 1

    availableBandwith = @dogmaContext.getShipAttribute(@ATTR_DRONEBANDWITH) - @drones.usedBandwith
    availableDrones = @dogmaContext.getCharacterAttribute(@ATTR_MAXACTIVEDRONES) - @drones.active

    droneCountBW = Math.min(Math.floor(availableBandwith / bandwith), count)
    droneCountDrones = Math.min(availableDrones, count)

    toBeAdded = Math.min(droneCountBW, droneCountDrones)

    if toBeAdded > 0
      d = {typeID: drone, count: toBeAdded}
      @dogmaContext.addDrone(drone, toBeAdded)
      @drones.inSpace.push(d)
      @drones.active += toBeAdded
      @drones.usedBandwith += bandwith * count

    # add drones in bay
    if (count - toBeAdded) > 0
      d = {typeID: drone, count: count-toBeAdded}
      @drones.inBay.push(d)


  getShipAttributes: (attrIDs) ->
    attr = {}
    for id in attrIDs
      attr[id] = @dogmaContext.getShipAttribute id
    return attr

  _getRawStats: ->
    stats = {}
    stats.tank = @getTank()
    stats.navigation = @getNavigation()
    stats.damage = @getDamage()
    stats.outgoing = @getOutgoing()
    return stats

  getStats: ->
    if @MODES[@ship]?
      modeStats = []
      for mode, id of @MODES[@ship]
        key = @dogmaContext.addModule id
        stats = @_getRawStats()
        @dogmaContext.removeModule key
        modeStats[mode] = stats

      return modeStats
    else
      @_getRawStats()


  getTank: ->
    attr = @getShipAttributes [109, 110, 111, 113, 267, 268, 269, 270, 271, 272, 273, 274, 9, 263, 265]
    tank = {}

      # calculate average reciprocal (e.g. 80% equals x5)
    tank.resihull = 1 / ((attr[109] + attr[110] + attr[111] + attr[113]) / 4);
    tank.resiarmor = 1 / ((attr[267] + attr[268] + attr[269] + attr[270]) / 4);
    tank.resishield = 1 / ((attr[271] + attr[272] + attr[273] + attr[274]) / 4);
    # calculate ehp
    tank.ehphull = attr[9] * tank.resihull;
    tank.ehparmor = attr[265] * tank.resiarmor;
    tank.ehpshield = attr[263] * tank.resishield;
    # sum up ehp
    tank.ehp = tank.ehphull + tank.ehparmor + tank.ehpshield;

    return tank

  getNavigation: ->
    attrIDs = [@ATTR_MAXVELOCITY, @ATTR_SIGNATURERADIUS]

    navigation = []
    for prop in @propmods
      stats = {}
      stats.typeID = prop.typeID
      stats.typeName = prop.typeName

      @dogmaContext.setModuleState(prop.key, DOGMA.STATE_Active) if prop.key != -1
      attr = @getShipAttributes attrIDs
      stats.speed = attr[@ATTR_MAXVELOCITY]
      stats.sig = attr[@ATTR_SIGNATURERADIUS]

      @dogmaContext.setModuleState(prop.key, DOGMA.STATE_Online) if prop.key != -1
      navigation.push stats

    return navigation

  getDamage: ->
    result = {}
    effects = [@EFFECT_MISSILES, @EFFECT_PROJECTILEFIRED, @EFFECT_TARGETATTACK, @EFFECT_SMARTBOMB]

    for m in @modules
      for e in effects
        if typeHasEffect(m.module, m.state, e)
          effectAttributes = @dogmaContext.getLocationEffectAttributes(
            DOGMA.LOC_Module, m.key, e)

          if effectAttributes.duration < 1e-300
            continue

          switch e
            when @EFFECT_MISSILES
              multiplier = @dogmaContext.getCharacterAttribute(
                @ATTR_MISSILEDAMAGEMULTIPLIER)
              emDamage = @dogmaContext.getChargeAttribute(
                m.key, @ATTR_EMDAMAGE)
              explosiveDamage = @dogmaContext.getChargeAttribute(
                m.key, @ATTR_EXPLOSIVEDAMAGE)
              kineticDamage = @dogmaContext.getChargeAttribute(
                m.key, @ATTR_KINETICDAMAGE)
              thermalDamage = @dogmaContext.getChargeAttribute(
                m.key, @ATTR_THERMALDAMAGE)
              
              dps = (multiplier * (emDamage + explosiveDamage + kineticDamage + thermalDamage)) / effectAttributes.duration
              if !result.missile?
                result.missile = {dps: 0}

                missileVelocity = @dogmaContext.getChargeAttribute(
                  m.key, @ATTR_MISSILEVELOCITY)
                flightTime = @dogmaContext.getChargeAttribute(
                  m.key, @ATTR_FLIGHTTIME)
                range = missileVelocity * flightTime / 1e6

                result.missile.range = range

                explosionVelocity = @dogmaContext.getChargeAttribute(
                  m.key, @ATTR_AOEVELOCITY)
                explosionRadius = @dogmaContext.getChargeAttribute(
                  m.key, @ATTR_AOEClOUDSIZE)
                drf = @dogmaContext.getChargeAttribute(
                  m.key, @ATTR_AOEDAMAGEREDUCTIONFACTOR)

                result.missile.explosionVelocity = explosionVelocity
                result.missile.explosionRadius = explosionRadius
                result.missile.drf = drf

              result.missile.dps += dps
            when @EFFECT_TARGETATTACK, @EFFECT_PROJECTILEFIRED
              multiplier = @dogmaContext.getModuleAttribute(
                m.key, @ATTR_DAMAGEMULTIPLIER)
              emDamage = @dogmaContext.getChargeAttribute(
                m.key, @ATTR_EMDAMAGE)
              explosiveDamage = @dogmaContext.getChargeAttribute(
                m.key, @ATTR_EXPLOSIVEDAMAGE)
              kineticDamage = @dogmaContext.getChargeAttribute(
                m.key, @ATTR_KINETICDAMAGE)
              thermalDamage = @dogmaContext.getChargeAttribute(
                m.key, @ATTR_THERMALDAMAGE)
              dps = multiplier * (emDamage + explosiveDamage + kineticDamage + thermalDamage) / effectAttributes.duration
              unless result.turret?
                result.turret = {}
                result.turret.dps = 0
                result.turret.optimal = effectAttributes.range / 1000
                result.turret.falloff = effectAttributes.falloff / 1000
                result.turret.tracking = effectAttributes.tracking
                sigRes = @dogmaContext.getModuleAttribute(m.key, @ATTR_OPTIMALSIGRADIUS)
                result.turret.signatureResolution = sigRes
              
              result.turret.dps += dps
            when @EFFECT_SMARTBOMB
              emDamage = @dogmaContext.getModuleAttribute(
                m.key, @ATTR_EMDAMAGE)
              explosiveDamage = @dogmaContext.getModuleAttribute(
                m.key, @ATTR_EXPLOSIVEDAMAGE)
              kineticDamage = @dogmaContext.getModuleAttribute(
                m.key, @ATTR_KINETICDAMAGE)
              thermalDamage = @dogmaContext.getModuleAttribute(
                m.key, @ATTR_THERMALDAMAGE)
              dps = multiplier * (emDamage + explosiveDamage + kineticDamage + thermalDamage) / effectAttributes.duration
              unless result.turret?
                result.smartbomb = {}
                result.smartbomb.dps = 0
                result.smartbomb.range = effectAttributes.range / 1000
              result.smartbomb.dps += dps

    for d in @drones.inSpace
      e = @EFFECT_TARGETATTACK
      if typeHasEffect d.typeID, DOGMA.STATE_Active, e
        effectAttributes = @dogmaContext.getLocationEffectAttributes(
          DOGMA.LOC_Drone, d.typeID, e)

        multiplier = @dogmaContext.getDroneAttribute(d.typeID, @ATTR_DAMAGEMULTIPLIER)
        emDamage = @dogmaContext.getDroneAttribute(d.typeID, @ATTR_EMDAMAGE)
        explosiveDamage = @dogmaContext.getDroneAttribute(d.typeID, @ATTR_EXPLOSIVEDAMAGE)
        kineticDamage = @dogmaContext.getDroneAttribute(d.typeID, @ATTR_KINETICDAMAGE)
        thermalDamage = @dogmaContext.getDroneAttribute(d.typeID, @ATTR_THERMALDAMAGE)
        dps = multiplier * (emDamage + explosiveDamage + kineticDamage + thermalDamage) / effectAttributes.duration * d.count
        
        # Sentry drone
        requiredSkill = @dogmaContext.getDroneAttribute(d.typeID, @ATTR_REQUIREDSKILL1)
        
        if requiredSkill == @TYPE_SENTRYDRONEINTERFACING
          unless result.sentries?
            result.sentries = {}
            result.sentries.dps = 0
            result.sentries.optimal = effectAttributes.range / 1000
            result.sentries.falloff = effectAttributes.falloff / 1000
          result.sentries.dps += dps
        else
          unless result.drones?
            result.drones = {}
            result.drones.dps = 0
            result.drones.range = @dogmaContext.getCharacterAttribute(@ATTR_DRONECONTROLRANGE) / 1000
            result.drones.speed = @dogmaContext.getDroneAttribute(d.typeID, @ATTR_MAXVELOCITY)
          result.drones.dps += dps

    _.each result, (item) ->
      item.dps *= 1000

    totalDPS = _.reduce result, (memo, value) ->
      memo + value.dps
    , 0

    result.total = totalDPS

    return result

  getOutgoing: ->
    result = {}

    effects = [@EFFECT_ARMORRR, @EFFECT_SHIELDTRANSFER]

    for m in @modules
      for e in effects
        if typeHasEffect m.module, m.state, e
          effectAttributes = @dogmaContext.getLocationEffectAttributes(
            DOGMA.LOC_Module, m.key, e)

          if effectAttributes.duration < 1e-300
            continue

          switch e
            when @EFFECT_ARMORRR
              amount = @dogmaContext.getModuleAttribute(
                m.key, @ATTR_ARMORRRAMOUNT)

              unless result.armor?
                result.armor = {}
                result.armor.range = effectAttributes.range / 1000
                result.armor.rr = 0

              result.armor.rr += amount / effectAttributes.duration

            when @EFFECT_SHIELDTRANSFER
              amount = @dogmaContext.getModuleAttribute(
                m.key, @ATTR_SHIELDBONUS)

              unless result.shield?
                result.shield = {}
                result.shield.range = effectAttributes.range / 1000
                result.shield.rr = 0

              result.shield.rr += amount / effectAttributes.duration

    _.each result, (item) ->
      item.rr *= 1000

    return result

class DescFleet
  constructor: ->
    @fleetContext = new FleetContext
    @squadCommander = null
    @wingCommander = null
    this.fits = []

  addFit: (fit) ->
    if @fleetContext.addSquadMember 0, 0, fit.dogmaContext
      @fits.push(fit)
    else
      throw new Meteor.Error 500, 'Error adding fit to fleet'

  setSquadCommander: (fit) ->
    if @fleetContext.addSquadCommander 0, 0, fit.dogmaContext
      @squadCommander = fit
    else
      throw new Meteor.Error 500, 'Error setting squad commander'

  setWingCommander: (fit) ->
    if @fleetContext.addWingCommander 0, fit.dogmaContext
      @wingCommander = fit
    else
      throw new Meteor.Error 500, 'Error setting wing commander'

Desc.ParseEFT = (fitting) ->
  parse =
    loadout:
      drones: []
      charges: []

  racks = [[],[],[],[],[]]
  currentRack = 0
  moduleCount = 0

  lines = fitting.split "\n"

  for l in lines
    l = l.trim()

    headerRegex = /\[([A-Za-z ]+), (.*)\]/
    droneRegex = /(.*) x([0-9]+)$/
    moduleRegex = /([A-Za-z0-9 '\-\(\)]+)(, )?(.*)?/

    if (l == '' || l == "\r") && moduleCount > 0
      currentRack++
      moduleCount = 0

    if (m = headerRegex.exec(l)) != null
      if id = lookupShip m[1]
        parse.shipTypeID = id
        parse.shipTypeName = m[1]
      else
        throw new Meteor.Error 500, 'Error reading ship'
    else if (m = droneRegex.exec(l)) != null
      if id = lookupDrone m[1]
        parse.loadout.drones.push({typeID: id, typeName: m[1], quantity: m[2]})
      else if id = lookupCharge m[1]
        parse.loadout.charges.push({typeID: id, typeName: m[1], quantity: m[2]})

    else if (m = moduleRegex.exec(l)) != null
      if idModule = lookupModule m[1]
        if m[3]?
          if idCharge = lookupCharge m[3]
            racks[currentRack].push
              typeID: idModule
              typeName: m[1]
              chargeID: idCharge
              chargeName: m[3]

            moduleCount++
          else
            throw new Meteor.Error 500, "Error reading charge"
        else
          racks[currentRack].push
            typeID: idModule
            typeName: m[1]
          moduleCount++

  [parse.loadout.lows, parse.loadout.mids, parse.loadout.highs, parse.loadout.rigs, parse.loadout.subs] = racks

  return parse

Desc.FromParse = (parse) ->
  f = new DescFitting
  f.setShip parse.shipTypeID

  addModule = (m) ->
    if m.chargeID?
      f.addModuleWithCharge m.typeID, m.chargeID
    else
      f.addModule m.typeID

  addModule module for module in parse.loadout.highs if parse.loadout.highs?
  addModule module for module in parse.loadout.mids if parse.loadout.mids?
  addModule module for module in parse.loadout.lows if parse.loadout.lows?
  addModule module for module in parse.loadout.rigs if parse.loadout.rigs?
  addModule module for module in parse.loadout.subs if parse.loadout.subs?
  
  for d in parse.loadout.drones
    f.addDrone d.typeID, d.quantity

  return f

Desc.FromEFT = (fitting) ->
  parse = Desc.ParseEFT fitting
  Desc.FromParse parse

Desc.getSkirmishLoki = ->
  f = new DescFitting
  f.setShip 29990
  f.addImplant 21890
  f.addModule 29977
  f.addModule 30070
  f.addModule 30161
  f.addModule 30135
  f.addModule 4286
  f.addModule 4288
  f.addModule 4290
  f.addModule 11014
  f.addModule 11014
  return f

Desc.getStandardLinks1 = ->
  f = new DescFitting
  f.setShip 29990
  f.addImplant 33405
  f.addModule 29977
  f.addModule 30070
  f.addModule 30161
  f.addModule 30135
  f.addModule 4286
  f.addModule 4288
  f.addModule 4290
  f.addModule 4284
  f.addModule 11014
  f.addModule 11014
  f.addModule 11014
  return f

Desc.getStandardLinks2 = ->
  f = new DescFitting
  f.setShip 29986
  f.addImplant 33403
  f.addModule 29967
  f.addModule 30040
  f.addModule 30076
  f.addModule 30120
  f.addModule 4264
  f.addModule 4272
  f.addModule 11014
  f.addModule 11014
  f.addModule 11014
  return f