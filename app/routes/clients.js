module.exports = App.ClientsRoute = Ember.Route.extend({
  model: function() {
    return this.store.findQuery('user', { level: 0 })
  }
});
