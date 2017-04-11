import Container from './util/container';
import config from './config';

let container = new Container();

//    *** STORAGE ***
container.set('storage-filesystem', function () {
  let Filesystem = require('./storage/filesystem/index').default;
  return new Filesystem(config.storage.directory);
});

container.set('storage-couch', function () {
  return require('./storage/filesystem/index');
});

container.set('storage', function () {
  return container.get('storage-' + config.storage.name);
});

//    *** ROUTE ***
container.set('route-package-request', function () {
  let Route = require('./routes/package-request').default;
  return new Route(container.get('storage'));
});

container.set('route-package-publish', function () {
  let Route = require('./routes/package-publish').default;
  return new Route(container.get('storage'), container.get('package-validator'));
});

container.set('route-package-get', function() {
  let Route = require('./routes/package-get').default;
  return new Route(container.get('storage'), container.get('package-validator'));
});

container.set('route-package-get-dist-tags', function() {
  let Route = require('./routes/package-get-dist-tags').default;
  return new Route(container.get('storage'), container.get('package-validator'));
});

container.set('route-package-remove', function() {
  let Route = require('./routes/package-remove').default;
  return new Route(container.get('storage'));
});

//    *** COMMANDS ***
container.set('command-serve', function () {
  let Command = require('./commands/serve').default;
  return new Command(container.get('express'), config.port);
});


//    *** UTILS ***
container.set('remote-registry', function () {
  let Route = require('./routes/add-user').default;
  return new Route();
});

container.set('express', function () {
  let express = require('express');
  let routes = require('./routes').default;
  let app     = express();
  app.set('env', process.env.NODE_ENV || 'production');
  routes(app, container);
  return app;
});

container.set('package-validator', function() {
  let packageValidator = require('./package/validator').default;
  return new packageValidator(container.get('storage'));
});

export default container;