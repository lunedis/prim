// Define App Constants

if (Meteor.App) {
  throw new Meteor.Error('Meteor.App already defined? see client/lib/constants.js');
}

Meteor.App = {
  NAME: 'MicroGang',
  DESCRIPTION: 'Public Roam Information Manager for the MicroGang Help channel'
};
