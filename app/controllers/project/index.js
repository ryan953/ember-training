var alias = Ember.computed.alias,
    not   = Ember.computed.not;

App.ProjectIndexController = Ember.ObjectController.extend({
  // Track the project budget and billing details
  hoursBudgeted: alias('hourBudget'),
  clientName:    alias('client.name'),
  isInternal:    not('client'),

  // Sum up the hours logged for the project by looping over
  // all of the time entries that have been entered towards it.
  hoursLogged: function () {
    return this.get('timeEntries').reduce(function (previous, timeEntry) {
      return timeEntry.get('hours') + (previous ? previous : 0);
    }) || 0;
  }.property('timeEntries.@each.hours'),
});
