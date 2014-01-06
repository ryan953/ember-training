'use strict';

module.exports = App.ProjectIndexRoute = Ember.Route.extend({
  model: function(){
    return this.modelFor('project');
  }
});
