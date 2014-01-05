module.exports = App.ClientEditRoute = Ember.Route.extend({
  /**
   * This route doesn't have its own model hook because it's nested in a route that has a model hook
   * ClientRoute#model retrieves a model, but that means that its only available in the ClientController
   * To make ClientRoute's model available in ClientEditController we must configure the ClientEditController via
   * setupController hook.
   */
  setupController: function(controller, model) {
    // get the client route's controller
    var clientController = this.controllerFor('client');
    // set this route's controller#content property to that of the clientController#content
    controller.set('content', clientController.get('content'));
  }
});