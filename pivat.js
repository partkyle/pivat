if (Meteor.is_client) {
  var setToken = function(token) {
    Session.set('token', token);
    $.cookie('token', token);

    // refresh projects maybe?
    refreshProjects();
  }

  var refreshProjects = function() {
    Session.set('processing', true);
    Meteor.call('projects', Session.get('token'), function(err, result) {
      var projects = $(result.content).find('project').map(function (v) {
        var self = $(this);
        return { id: self.find('id').first().text(), name: self.find('name').first().text() };
      });

      Session.set('projects', projects);
      Session.set('processing', false);
    });
  }

  if ($.cookie('token')) {
    Session.set('token', $.cookie('token'));
    refreshProjects();
  }

  Template.navbar.token = function() {
    return Session.get('token');
  };

  Template.navbar.events = {
    'change input': function(e) {
      setToken(e.target.value);
    }
  }

  Template.processing.processing = function() {
    return Session.get('processing');
  }

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
