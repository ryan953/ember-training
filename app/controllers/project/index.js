'use strict';

var c = Ember.computed;

module.exports = App.ProjectIndexController = Ember.ObjectController.extend({
  // Track the project budget and billing details
  hoursBudgeted: c.alias('hourBudget'),
  clientName: c.alias('client.name'),
  isInternal: c.not('client'),

  // Sum up the hours logged for the project by looping over
  // all of the time entries that have been entered towards it.
  hoursLogged: function () {
    return this.get('timeEntries').reduce(function (previous, timeEntry) {
      return timeEntry.get('hours') + (previous ? previous : 0);
    }) || 0;
  }.property('timeEntries.@each.hours'),
});
