'use strict';

module.exports = App.ProjectIndexController = Ember.ObjectController.extend({
  contentBinding: 'controllers.project',
  needs: 'project',
});
