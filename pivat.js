
if (Meteor.is_client) {
  var token = document.cookie || prompt('Pivotal token pls!');
  document.cookie = token;

  var projects;

  Meteor.call('projects', token, function(err, result) {
    console.log();
    projects = $(result.content).find('project').map(function (v) {
      var self = $(this);
      return { id: self.find('id').first().text(), name: self.find('name').first().text() };
    });

    Session.set('projects', projects);
  });

  Template.projects.projects = function() {
    return Session.get('projects');
  };

  Template.hello.greeting = function () {
    return "Welcome to pivat.";
  };

  Template.hello.events = {
    'click input' : function () {
      Meteor.call('projects', function(err, result) {
        console.log(result);
      });
      console.log('clicked');
    }
  };
}

if (Meteor.is_server) {
  Meteor.startup(function () {
    var Project = Backbone.Model.extend({
      url: 'http://www.pivotaltracker.com/services/v3/projects'
    });

    var ProjectCollection = Backbone.Collection.extend({
      url: 'http://www.pivotaltracker.com/services/v3/projects',
      model: Project
    });

    Meteor.methods({
      projects: function(token) {
        return Meteor.http.get('http://www.pivotaltracker.com/services/v3/projects', { headers: {'X-TrackerToken': token } });
      }
    });

  });
}
