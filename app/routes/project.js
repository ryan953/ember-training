App.ProjectRoute = Ember.Route.extend({
  model: function (params) {
    return this.store.find('project', params.id);
  },

  actions: {
    willTransition: function(transition) {
      var controller = this.controllerFor('project');
      var model = controller.get('content');

      if (model.get('isDirty') && !confirm("Are you sure you want to abandon progress?")) {
        transition.abort();
        return false;
      } else {
        model.rollback();
        return true;
      }
    }
  }
});
