"use strict";
const loopback = require('loopback');
const boot = require('loopback-boot');

const oldSetup = loopback.PersistedModel.setup;
const updateParent = function(ParentModel, newChildrenModelName) {
  if (ParentModel.definition.settings.__children_models__) {
    ParentModel.definition.settings.__children_models__.push(newChildrenModelName);
    updateParent(ParentModel.base, newChildrenModelName);
  }
};

loopback.PersistedModel.setup = function () {
  const Model = this;

  Model.defineProperty("__model_name__", {
    type: String,
    index: true,
    default: Model.definition.name,
    hidden: true
  });

  if (!Model.definition.settings.hidden) {
    Model.definition.settings.hidden = [];
  }
  Model.definition.settings.hidden.push("__model_name__");
  Model.definition.settings.__children_models__ = [];
  updateParent(Model, Model.definition.name);

  Model.observe("access", function (ctx, next) {
    if (ctx.childrenModelsHasFiltered) {
      return next();
    }
    ctx.childrenModelsHasFiltered = true;
    const __children_models__ = ctx.Model.definition.settings.__children_models__;
    let or = __children_models__.map((model) => {
      return {__model_name__: model};
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

const app = module.exports = loopback();

app.start = function () {
  // start the web server
  return app.listen(function () {
    app.emit('started');
    let baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      let explorerPath = app.get('loopback-component-explorer').mountPath;
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
