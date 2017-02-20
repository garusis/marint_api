"use strict";
import ModelBuilder from "loopback-build-model-helper"
import * as commonOp from "../../server/helpers/common-operations"
import app from "../../server/server"

module.exports = function (_Comment) {

  const builder = new ModelBuilder(Comment, _Comment)

  builder.build().then(function () {

    _Comment.belongsTo("author", {
      polymorphic: {
        "foreignKey": "account_id",
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
    let {data, options, oldCreate} = await commonOp.normalizeCreateWithPolymorphicOwner(arguments)

    let Account = app.models[data.account_type]
    let account = await Account.findById(data.account_id)
    data.publisherName = `${account.name} ${account.surname}`

    let comment = await oldCreate.call(this, data, options)
    return comment
  }

  function Comment() {
  }

};
