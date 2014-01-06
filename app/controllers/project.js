'use strict';

module.exports = App.ProjectController = Ember.ObjectController.extend({
  managerName: Ember.computed.alias('managedBy.name'),
  clientName: Ember.computed.alias('client.name'),
  hoursBudgeted: Ember.computed.alias('hourBudget'),
  hoursLogged: function () {
    return this.get('timeEntries').reduce(function (previous, timeEntry) {
      return timeEntry.get('hours') + (previous ? previous : 0);
    }) || 0;
  }.property('timeEntries.@each.hours'),
});
