'use strict';

module.exports = App.User = DS.Model.extend({
  email: DS.attr('string'),
  fname: DS.attr('string'),
  lname: DS.attr('string'),
  name: function () {
    return this.get('fname') + ' ' + this.get('lname');
  }.property('fname', 'lname')
});
