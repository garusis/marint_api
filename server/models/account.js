'use strict'
import ModelBuilder from "loopback-build-model-helper"
import dh from "debug-helper"
import app from "../server"
import {instanceOf} from "../helpers/common-operations"
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

      if (!token) {
        return process.nextTick(() => cb(null, false));
      }

      let Model = context.model
      let uploaderRelation = _.find(Model.relations, (relation) => relation.type === 'belongsTo' && relation.options.defineOwner)
        || Model.relations.owner || Model.relations.user || Model.relations.account
        || _.find(Model.relations, function (relation) {
          return relation.type === 'belongsTo' && instanceOf(relation.modelTo, User) && !relation.options.noDefineOwner
        })

      if (!uploaderRelation) {
        return process.nextTick(() => cb(new Error(`${Model.definition.name} has not an relation defining $owner resource`)));
      }

      let where = {id: context.modelId}

      if (!uploaderRelation.polymorphic) {
        if (!instanceOf(uploaderRelation.modelTo, AccountModel)) return process.nextTick(() => cb(null, false));
        //Should be instanceOf? OR should be Equals OR Equals or descendent?
      } else {
        where[uploaderRelation.polymorphic.discriminator] = token.account_type
      }
      where[uploaderRelation.keyFrom] = token.userId

      Model.findOne({where}, function (err, resource) {
        if (err) return cb(err);
        if (!resource) return cb(null, false);
      })
    })

  })

  function Account() {
  }

}
