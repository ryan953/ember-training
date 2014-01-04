'use strict';

module.exports = App.TimeEntry = DS.Model.extend({
  billed: DS.attr('boolean'),
  date: DS.attr('date'),
  hours: DS.attr('number'),
  note: DS.attr('string'),
  project: DS.belongsTo('project')
});
