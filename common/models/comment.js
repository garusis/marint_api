"use strict";
import ModelBuilder from "loopback-build-model-helper"

module.exports = function (_Comment) {

  const builder = new ModelBuilder(Comment, _Comment)

  builder.build().then(function () {
    _Comment.belongsTo("account", {
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

  function Comment() {
  }

};
