'use strict';

module.exports = App.ProjectController = Ember.ObjectController.extend({
  managerName: function () {
    return this.get('managedBy.name')
  }.property('managedBy.name'),

  clientName: function () {
    return this.get('client.name')
  }.property('client.name'),

  hoursLogged: function () {
    return this.get('timeEntries').reduce(function (previous, timeEntry) {
      return timeEntry.get('hours') + (previous ? previous : 0);
    });
  }.property('timeEntries.@each.hours'),

  hoursBudgeted: function () {
    return this.get('hourBudget');
  }.property('hourBudget'),
});
