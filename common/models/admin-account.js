"use strict"
import ModelBuilder from "loopback-build-model-helper"
import app from "../../server/server"

module.exports = function (_AdminAccount) {

  let builder = new ModelBuilder(AdminAccount, _AdminAccount)
  let RoleHelper

  builder.build().then(function () {
    RoleHelper = app.models.RoleHelper

    _AdminAccount.observe('after save', async function (ctx, next) {
      if (ctx.isNewInstance) {
        await RoleHelper.assignTo('admin', ctx.instance.id)
      }
      next()
    })
  })


  function AdminAccount() {
  }
}
