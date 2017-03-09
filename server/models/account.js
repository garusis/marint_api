'use strict'
import ModelBuilder from "loopback-build-model-helper"
import request from "request-promise"
import dh from "debug-helper"
import app from "../server"
import { instanceOf } from "../helpers/common-operations"
import _ from "lodash"

module.exports = function (_Account) {

  //TODO: Update all of its comments to update publisherName
  //TODO: Add RoleMapping model to fix security issues with polymorphic users.

  const builder = new ModelBuilder(Account, _Account)

  builder.build().then(function () {
    let models = app.models
    let User = models.User
    let Role = models.Role

    Role.registerResolver('$owner', function (role, context, cb) {
      let token = context.accessToken;
      let AccountModel = models[token.account_type]

      if (!token || token.id === "$anonymous" || !context.modelId) {
        return process.nextTick(() => cb(null, false));
      }

      let Model = context.model
      if (Model === AccountModel) {
        //is an instance of the same Model
        return process.nextTick(() => cb(null, token.userId === +context.modelId));
      }

      let ownerRelation = _.find(Model.relations, (relation) => relation.type === 'belongsTo' && relation.options.defineOwner)
        || Model.relations.owner || Model.relations.user || Model.relations.account
        || _.find(Model.relations, function (relation) {
          return relation.type === 'belongsTo' && instanceOf(relation.modelTo, User) && !relation.options.noDefineOwner
        })

      if (!ownerRelation) {
        if (instanceOf(Model, User)) {
          return process.nextTick(() => cb(null, false));
        } else {
          return process.nextTick(() => cb(new Error(`${Model.definition.name} has not an relation defining $owner resource`)));
        }
      }

      let where = {id: context.modelId}

      if (!ownerRelation.polymorphic) {
        if (!instanceOf(ownerRelation.modelTo, AccountModel)) return process.nextTick(() => cb(null, false));
      } else {
        where[ownerRelation.polymorphic.discriminator] = token.account_type
      }
      where[ownerRelation.keyFrom] = token.userId

      Model.findOne({where}, function (err, resource) {
        if (err) return cb(err);
        return cb(null, !!resource);
      })
    })

    Role.registerResolver('human', function (role, context, cb) {

      let {data, options} = context.remotingContext.args
      let recaptchaResponse = data.gRecaptchaResponse
      delete data.gRecaptchaResponse

      if (!recaptchaResponse) {
        return process.nextTick(() => cb(null, false))
      }

      request
        .post(process.env.RECAPTCHA_VERIFY_URL, {
          json: true,
          qs: {
            secret: process.env.RECAPTCHA_SECRET,
            response: recaptchaResponse,
            remoteip: options.remoteIp
          }
        })
        .then(function (response) {
          cb(null, !!response.success)
        })
        .catch(cb)
    })

  })

  function Account () {
  }

}
