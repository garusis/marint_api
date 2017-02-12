'use strict';
import ModelBuilder from "loopback-build-model-helper";
import Promise from "bluebird"
import app from "../../server/server"

module.exports = function (_Publication) {
  const builder = new ModelBuilder(Publication, _Publication)

  builder.build().then(function () {

    _Publication.belongsTo("instructor", {
      polymorphic: {
        "foreignKey": "account_id",
        "discriminator": "account_type"
      }
    })

  })

  _Publication.beforeRemote('create', function (ctx, instance, next) {
    let accessToken = ctx.req.accessToken
    let data = ctx.args.data
    data.account_id = accessToken.account_id
    data.account_type = accessToken.account_type
    next()
  })

  _Publication.beforeRemote('prototype.__create__comments', function (ctx, instance, next) {
    let accessToken = ctx.req.accessToken
    let data = ctx.args.data
    data.account_id = accessToken.account_id
    data.account_type = accessToken.account_type
    next()
  })

  function Publication() {

  }

};
