"use strict";
import ModelBuilder from "loopback-build-model-helper"
import app from "../../server/server"
import _ from "lodash"

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


  Comment.create = async function (data, options, oldCreate) {
    if (_.isUndefined(oldCreate)) {
      if (_.isFunction(options)) {
        oldCreate = options;
        options = {};
      } else if (_.isFunction(data)) {
        oldCreate = data;
        data = {};
      }
    }
    data = data || {};
    options = options || {};

    let accessToken = options.accessToken
    data.account_id = accessToken.account_id
    data.account_type = accessToken.account_type

    let Account = app.models[data.account_type]
    let account = await Account.findById(data.account_id)

    data.publisherName = `${account.name} ${account.surname}`

    let comment = await oldCreate.call(this, data, options)
    return comment
  }

  function Comment() {
  }

};
