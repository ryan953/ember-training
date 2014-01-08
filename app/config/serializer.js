App.ApplicationSerializer = DS.FreshBooksApiSerializer.extend({
  keyForAttribute: function (key) {
    return Ember.String.underscore(key);
  },

  keyForRelationship: function (key) {
    return Ember.String.underscore(key);
  },
});
