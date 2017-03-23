"use strict";
import ModelBuilder from "loopback-build-model-helper"
import * as commonOp from "../../server/helpers/common-operations"
import app from "../../server/server"
import _ from "lodash"

module.exports = function (_Comment) {

  const builder = new ModelBuilder(Comment, _Comment)

  builder.build().then(function () {

    _Comment.belongsTo("author", {
      polymorphic: {
        "foreignKey": "userId",
        "discriminator": "account_type"
      }
    })

    _Comment.belongsTo("publication", {
      polymorphic: {
        "foreignKey": "publication_id",
        "discriminator": "publication_type"
      }
    })

  })

  Comment.create = async function () {
    let {data, options, oldCreate} = await commonOp.normalizeCreateWithOwner(arguments, true)

    if (data.userId) {
      let Account = app.models[data.account_type]
      let account = await Account.findById(data.userId)
      data.publisherName = `${account.name} ${account.surname}`
    }

    let comment = await oldCreate.call(this, data, options)
    return comment
  }

  Comment.find = async function () {
    let {filter, options, oldFind} = await commonOp.normalizeFindWithInclude(arguments)

    filter.include.push({relation: "author", scope: {include: "image"}})

    return await oldFind.call(this, filter, options)
  }


  function Comment () {
  }

};
