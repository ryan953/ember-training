'use strict';

Ember.LOG_BINDINGS = true;

var config = {
    LOG_TRANSITIONS: true,
    LOG_TRANSITIONS_INTERNAL: true,
    LOG_VIEW_LOOKUPS: true,
    LOG_ACTIVE_GENERATION: true
  };

module.exports = Ember.Application.create(config);
