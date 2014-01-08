App.ProjectsController = Ember.ArrayController.extend({
  sortProperties: ['id'],
  itemController: 'ProjectIndex',
  url: 'project',
});
