App.ProjectEditController = Ember.ObjectController.extend({
  // Load up a list of users that the project can be assigned
  // to, which we'll use for populating the select list.
  clients: function () {
    return this.store.findAll('user');
  }.property(),
});
