'use strict';

Ember.Handlebars.registerBoundHelper('time-since', function(date) {
  return moment(date).calendar();
});
