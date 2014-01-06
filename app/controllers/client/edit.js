/**
 * Ember will attempt to guess the appropriate controller class depending on the object type of the return value of the
 * Route#model hook. When a route, such as App.ClientEditRoute, doesn't have a model hook, Ember will automatically
 * generate an instance of a controller from Controller class. For App.ClientEditRoute, we want Ember to have an instance
 * of Ember.ObjectController which serves as a proxy to the App.ClientEditController#content property.
 *
 * To force Ember to use the Ember.ObjectController, we have to explicitly declare the App.ClientEditController class.
 */
module.exports = App.ClientEditController = Ember.ObjectController.extend({
  isSavable: Ember.computed.not('isDirty')
});