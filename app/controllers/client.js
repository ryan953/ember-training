module.exports = App.ClientController = Ember.ObjectController.extend({
  /**
   * We want to be able to hide the Edit button when we're in the edit route. The application controller has currentPath
   * property that shows the current active route. We can use a computed property to determine when
   * currentPath === 'client.edit' but to be able to use currentPath, we need to have access to the application controller.
   * needs property allows you to configure what controllers this controller will have access to. ['application'] makes
   * the ApplicationController available on controllers.application.
   *
   * @see http://emberjs.com/guides/controllers/dependencies-between-controllers/
   * @see http://emberjs.com/guides/understanding-ember/debugging/#toc_get-current-route-name-path
   */
  needs: ['application'],
  isEditing: Ember.computed.equal('controllers.application.currentPath', 'client.edit')
});