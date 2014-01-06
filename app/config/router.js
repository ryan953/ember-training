'use strict';

module.exports = App.Router.map(function() {

  this.resource('projects');
  this.resource('project', { path: '/projects/:id' }, function () {
    this.route('edit');
  });

  this.resource('clients');
  this.resource('client.new', {path: '/client/new'});
  this.resource('client', {path: 'clients/:id'}, function(){
    this.route('edit');
  });

});
