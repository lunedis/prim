roughly = (test, actual, expected, epsilon) ->
  test.equal((actual - expected) < epsilon, true)

Tinytest.add 'desc dps turret application', (test) ->
  stats =
    turret:
      dps: 55.21825396825397
      optimal: 62.1187658767872
      falloff: 12.5
      tracking: 0.031640625
      signatureResolution: 400
    total: 55.21825396825397

  navigation =
    speed: 0
    sig: 140

  dps = Desc.dps stats, navigation, 40
  roughly test, dps, 56.6, 1e-1
  dps = Desc.dps stats, navigation, 70
  roughly test, dps, 38, 2

  navigation = 
    speed: 219
    sig: 140

  dps = Desc.dps stats, navigation, 63
  roughly test, dps, 51, 2

Tinytest.add 'desc dps missile application', (test) ->
  stats =
    missile: 
      dps: 91.08608656580779
      range: 63.28125
      explosionVelocity: 255
      explosionRadius: 30
      drf: 2.8
    total: 91.08608656580779

  navigation =
    speed: 0
    sig: 74.3

  dps = Desc.dps stats, navigation, 50
  roughly test, dps, 91, 1
  dps = Desc.dps stats, navigation, 70
  test.equal dps, 0

  navigation =
    speed: 4771
    sig: 74.3

  dps = Desc.dps stats, navigation, 50
  roughly test, dps, 27, 1