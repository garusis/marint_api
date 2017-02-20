"use strict"
import ModelBuilder from "loopback-build-model-helper"

module.exports = function (_AccessTokenAccount) {

  const builder = new ModelBuilder(AccessTokenAccount, _AccessTokenAccount)

  builder.build().then(function () {
    _AccessTokenAccount.belongsTo('user', {
      polymorphic: {
        "foreignKey": "userId",
        "discriminator": "account_type"
      },
      options:{
        defineOwner: true
      }
    })
  })

  function AccessTokenAccount() {
  }
}
