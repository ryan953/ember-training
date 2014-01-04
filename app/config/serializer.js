'use strict';

module.exports = App.ApplicationSerializer = DS.JsonApiSerializer.extend({
  keyForAttribute: function (key) {
    return Ember.String.underscore(key);
  },

  keyForRelationship: function (key) {
    return Ember.String.underscore(key);
  },
});
