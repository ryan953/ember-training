var models = require('./data/models'),
    fortune = require('fortune'),
    path = require('path'),
    express = require('express');

exports.startServer = function(port, publicDir, callback) {
  var app = express();

  var api = fortune({
    db: '/data',
    path: path.resolve('.')
  });

  for(model in models) {
    var schema = models[model];
    api.resource(model, schema);
    console.log('Registered %s api resource.', model);
  }

  app.use(api.router);
  app.use(express.static(publicDir));

  app.listen(port);

  console.log('Started server on localhost:' + port);
};