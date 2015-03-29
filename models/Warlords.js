Warlords = new Mongo.Collection('warlords');

Warlords.attachSchema(
	new SimpleSchema({
	characterID: {
		type: String
	},
	characterName: {
		type: String
	},
	corporationName: {
		type: String
	},
	joinDate: {
		type: Date
	},
	comment: {
		type: String
	}
	})
);

// Collection2 already does schema checking
// Add custom permission rules if needed
if (Meteor.isServer) {
	Warlords.allow({
		insert : function () {
			return true;
		},
		update : function () {
			return true;
		},
		remove : function () {
			return true;
		}
	});
}
