App.Task = DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  billable: DS.attr('boolean'),
  rateAmount: DS.attr('number'),
});
