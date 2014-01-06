module.exports = App.ClientNewRoute = Ember.Route.extend({
  actions: {
    save: function() {
      this.modelFor('client.new').save();
      this.transitionTo('clients');
    },
    cancel: function() {
      this.modelFor('client.new').destroy();
      this.transitionTo('clients');
    }
  },
  model: function() {
    return this.store.createRecord('user');
  },
  renderTemplate: function() {
    this.render('client.edit', {
      controller: this.controllerFor('client.new')
    });
  }
});
