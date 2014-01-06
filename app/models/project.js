'use strict';

module.exports = App.Project = DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  hourBudget: DS.attr('number'),
  rateAmount: DS.attr('number'),
  managedBy: DS.belongsTo('user'),
  client: DS.belongsTo('user'),
  users: DS.hasMany('user', { async: true }),
  tasks: DS.hasMany('task', { async: true }),
  timeEntries: DS.hasMany('time_entry', { async: true }),
});
