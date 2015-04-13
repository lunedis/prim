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
				highs: [
					{typeID: "2929", typeName: "800mm Repeating Artillery II"},
					{typeID: "2929", typeName: "800mm Repeating Artillery II"},
					{typeID: "2929", typeName: "800mm Repeating Artillery II"},
					{typeID: "2929", typeName: "800mm Repeating Artillery II"},
					{typeID: "2929", typeName: "800mm Repeating Artillery II"},
					{typeID: "2929", typeName: "800mm Repeating Artillery II"},
					{typeID: "2929", typeName: "800mm Repeating Artillery II"},
					{typeID: "15084", typeName: "Imperial Navy Heavy Energy Neutralizer"}
				],
				mids: [
				],
				lows: [
					{typeID: "2048", typeName: "Damage Control II"},
				],
				rigs: {

				}
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
