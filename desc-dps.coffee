Desc = {}

Desc.dps = (stats, n, distance) ->
  dps = 0
  if stats.turret?
    t = stats.turret
    dps += stats.turret.dps * Desc.turretApplication(
      t.optimal, t.falloff, t.tracking, t.signatureResolution,
      n.speed, n.sig, distance)

  if stats.missile?
    m = stats.missile
    dps += stats.missile.dps * Desc.missileApplication(
      m.range, m.explosionRadius, m.explosionVelocity, m.drf, 
      n.speed, n.sig, distance)

  return dps

Desc.turretApplication = (optimal, falloff, tracking, sigres, speed, sig, distance) ->
  distance *= 1000
  optimal *= 1000
  falloff *= 1000

  trackingPart = Math.pow((speed / (distance * tracking)) * (sigres / sig), 2)
  rangePart = Math.pow(Math.max(0, distance - optimal) / falloff, 2)
  chanceToHit = Math.pow(0.5, trackingPart + rangePart)
  if chanceToHit < 0.01
    3 * chanceToHit
  else
    (Math.pow(chanceToHit,2) + chanceToHit + 0.0499) / 2

Desc.missileApplication = (range, explosionRadius, explosionVelocity, drf, speed, sig, distance) ->
  if (distance > range)
    return 0

  sigPart = sig / explosionRadius
  sigSpeedPart = Math.pow((sig / explosionRadius) * (explosionVelocity / speed), Math.log(drf) / Math.log(5.5))

  Math.min(1, sigPart, sigSpeedPart)