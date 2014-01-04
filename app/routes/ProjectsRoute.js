module.exports = Ember.Route.extend({
  model: function() {
    return ['project1', 'project2', 'project3'];
  }
});