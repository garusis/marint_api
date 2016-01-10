var loopback = require('loopback');
var boot = require('loopback-boot');

var oldSetup = loopback.PersistedModel.setup;
var updateParent = function (ParentModel, newChildrenModelName) {
  if (ParentModel.definition.settings.__children_models) {
    ParentModel.definition.settings.__children_models.push(newChildrenModelName);
    updateParent(ParentModel.base, newChildrenModelName);
  }
};
loopback.PersistedModel.setup = function () {
  var Model = this;

  //TODO: HAY UN ERROR DEBIDO A QUE ESTOY PERMITIENDO QUE DESDE UNA CLASE HIJA SE LISTEN A LOS PERTENECIENTES A LAS CLASES PADRES...
  // Y DEBE SER JUSTO AL CONTRARIO
  Model.defineProperty("__model_name", {
    type: String,
    index: true,
    default: Model.definition.name,
    hidden: true
  });

  if (!Model.definition.settings.hidden) {
    Model.definition.settings.hidden = [];
  }
  Model.definition.settings.hidden.push("__model_name");
  Model.definition.settings.__children_models = [];
  updateParent(Model, Model.definition.name);

  Model.observe("access", function (ctx, next) {
    var __children_models = ctx.Model.definition.settings.__children_models;
    var or = __children_models.map(function (model) {
      return {__model_name: model};
    });

    if (ctx.query.where) {
      ctx.query.where = {
        and: [
          {or: or},
          ctx.query.where
        ]
      };
    } else {
      ctx.query.where = {
        or: or
      };
    }
    next();
  });
  oldSetup.apply(Model, arguments);
};

var app = module.exports = loopback();

app.start = function () {
  // start the web server
  return app.listen(function () {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
