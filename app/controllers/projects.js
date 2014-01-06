'use strict';

module.exports = App.ProjectsController = Ember.ArrayController.extend({
  sortProperties: ['id'],
  itemController: 'ProjectIndex',
});
