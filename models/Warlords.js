Warlords = new Mongo.Collection('warlords');

Warlords.attachSchema(
	new SimpleSchema({
	characterID: {
		type: Number,
		min: 0,
		label: "CharacterID"
	},
	characterName: {
		type: String,
		label: "Character Name",
		max: 100
	},
	corporationName: {
		type: String,
		label: "Corporation Name",
		max: 100
	},
	comment: {
		type: String,
		label: "Comment"
	}
	})
);

// Collection2 already does schema checking
// Add custom permission rules if needed
if (Meteor.isServer) {
	Warlords.allow({
		insert : function () {
			if(Meteor.user())
        		return true;
      		else
    			return false;
		},
		update : function () {
			if(Meteor.user())
		    	return true;
			else
				return false;
		},
		remove : function () {
			if(Meteor.user())
        		return true;
      		else
        		return false;
		}
	});
}
