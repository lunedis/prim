Template['fittings'].helpers({
	fits: function() {
		return [{
			_id: "blablabla",
			shipTypeID: 17738,
			shipTypeName: "Machariel",
			subtitle: "MWD Autocannon",
			difficulty: "hard",
			role: "DPS",
			description: "The Machariel excels in dealing great damage from range as well as bringing the usual Battleship utility in form of Heavy Energy Neutralizer and Disruptors or Webs, while still retaining great mobility on the battlefield.",
			fit: {
				lows: [ 
					{ typeID: 5837, typeName: 'Pseudoelectron Containment Field I' },
					{ typeID: 2364, typeName: 'Heat Sink II' },
					{ typeID: 2364, typeName: 'Heat Sink II' },
					{ typeID: 2364, typeName: 'Heat Sink II' },
					{ typeID: 1999, typeName: 'Tracking Enhancer II' },
					{ typeID: 1355, typeName: 'Reactor Control Unit II' } ],
				mids: [ 
					{ typeID: 3841, typeName: 'Large Shield Extender II' },
					{ typeID: 5975, typeName: 'Experimental 10MN Microwarpdrive I' },
					{ typeID: 5011, typeName: 'Small Electrochemical Capacitor Booster I',
						chargeID: 32006, chargeName: 'Navy Cap Booster 400' } ],
				highs: [ 
					{ typeID: 3025, typeName: 'Heavy Beam Laser II',
						chargeID: 23095, chargeName: 'Imperial Navy Ultraviolet M' },
					{ typeID: 3025,
						typeName: 'Heavy Beam Laser II',
						chargeID: 23095,
						chargeName: 'Imperial Navy Ultraviolet M' },
					{ typeID: 3025, typeName: 'Heavy Beam Laser II',
						chargeID: 23095, chargeName: 'Imperial Navy Ultraviolet M' },
					{ typeID: 3025, typeName: 'Heavy Beam Laser II',
						chargeID: 23095, chargeName: 'Imperial Navy Ultraviolet M' },
					{ typeID: 3025, typeName: 'Heavy Beam Laser II',
						chargeID: 23095, chargeName: 'Imperial Navy Ultraviolet M' } ],
				rigs: [ 
					{ typeID: 31360, typeName: 'Medium Ancillary Current Router I' },
					{ typeID: 31480, typeName: 'Medium Energy Locus Coordinator I' },
					{ typeID: 31718, typeName: 'Medium Anti-EM Screen Reinforcer I' } ],
				subs: [], 
			},
			stats: {
				ehp: "20,070 (25,085)",
				speed: "2845 m/s",
				dps: "305",
				range: "42 km"
			},
			tips: [
				"Beware of the locktime of the Battleship. An incoming tackler can be quite close before you even lock him.",
				"blablabla"
			],		
			cpuDoctor: "blablabla",
			powergridDoctor: "blablabla",
			eft: ""
		}];
	}
});

Template['fittings'].events({
	"submit .test": function() {
		try {
			var text = event.target.text.value;
			Meteor.call("dogmaTest", text);	
		} catch (e) {
			throw new Meteor.Error(500,e.reason, e.details);
		}
	}
});
