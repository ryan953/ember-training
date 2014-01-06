'use strict';

module.exports = App.ProjectEditController = Ember.ObjectController.extend({
  projectBinding: 'controllers.project',
  needs: 'project',

  // Load up a list of users that the project can be assigned
  // to, which we'll use for populating the select list.
  allUsers: function () {
    return this.store.findAll('user');
  }.property(),

  // And then filter down to only clients.
  clients: function () {
    return this.get('allUsers').filterBy('role', 'client');
  }.property('allUsers.isFulfilled'),

  // And also filter down to valid managers
  managers: function () {
    return this.get('allUsers').rejectBy('role', 'client');
  }.property('allUsers.isFulfilled'),
});
