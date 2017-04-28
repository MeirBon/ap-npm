import Container from './util/container';


export default function(configFile) {
  let container = new Container();

  ///   *** CONFIG ***
  container.set('config', function() {
    return require(configFile);
  });

//    *** STORAGE ***
  container.set('storage-filesystem', function () {
    let Filesystem = require('./storage/filesystem/index').default;
    return new Filesystem(container.get('config'));
  });

  container.set('storage-couch', function () {
    return require('./storage/filesystem/index');
  });

  container.set('storage', function () {
    return container.get('storage-filesystem');
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

  container.set('route-package-delete', function() {
    let Route = require('./routes/package-delete').default;
    return new Route(container.get('storage'), container.get('package-validator'), container.get('config'));
  });

  container.set('route-package-get', function() {
    let Route = require('./routes/package-get').default;
    return new Route(container.get('storage'), container.get('package-validator'));
  });

  container.set('route-package-get-dist-tags', function() {
    let Route = require('./routes/package-get-dist-tags').default;
    return new Route(container.get('storage'), container.get('package-validator'));
  });

  container.set('route-package-delete-dist-tags', function() {
    let Route = require('./routes/package-delete-dist-tags').default;
    return new Route(container.get('storage'), container.get('package-validator'));
  });

  container.set('route-package-add-dist-tags', function() {
    let Route = require('./routes/package-add-dist-tags').default;
    return new Route(container.get('storage'), container.get('package-validator'));
  });

// AUTH
  container.set('route-auth-user-login', function() {
    let Route = require('./routes/auth-user-login').default;
    return new Route(container.get('auth'));
  });

  container.set('route-auth-whoami', function() {
    let Route = require('./routes/auth-whoami').default;
    return new Route(container.get('auth'));
  });

  container.set('route-auth-user-logout', function () {
    let Route = require('./routes/auth-user-logout').default;
    return new Route(container.get('auth'));
  });


//    *** COMMANDS ***
  container.set('command-serve', function () {
    let Command = require('./commands/serve').default;
    return new Command(container.get('express'), container.get('config'));
  });


//    *** UTILS ***
  container.set('remote-registry', function () {
    let Route = require('./routes/auth-user-add').default;
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
    let PackageValidator = require('./package/validator').default;
    return new PackageValidator(container.get('storage'));
  });

  container.set('auth', function() {
    let Auth = require('./auth/index').default;
    return new Auth(container.get('auth-adapter'), container.get('config'));
  });

  container.set('auth-adapter', function() {
    let AuthAdapter = require(container.get('config').auth.adapter).default;
    return new AuthAdapter(container.get('config'));
  });

  return container;
}