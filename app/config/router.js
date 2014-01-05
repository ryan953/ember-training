'use strict';

module.exports = App.Router.map(function() {

  this.resource('projects');
  this.resource('clients');
  this.resource('client', {path: 'clients/:id'}, function(){
    this.route('edit')
  });

});
