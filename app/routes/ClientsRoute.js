module.exports = App.ClientsRoute = Ember.Route.extend({
  model: function() {
    return this.store.findAll('user')
  }
});