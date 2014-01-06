module.exports = App.ClientEditRoute = Ember.Route.extend({
  actions: {
    save: function() {
      this.modelFor('client').save().then(function(){
        this.transitionTo('clients');
      });
    },
    cancel: function() {
      this.modelFor('client').rollback();
      this.transitionTo('clients');
    }
  },
  model: function(){
    return this.modelFor('client');
  }
});
