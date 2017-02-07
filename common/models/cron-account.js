"use strict"
import ModelBuilder from "loopback-build-model-helper"
import app from "../../server/server"

module.exports = function (_CronAccount) {

  let builder = new ModelBuilder(CronAccount, _CronAccount)
  let RoleHelper

  builder.build().then(function () {
    RoleHelper = app.models.RoleHelper

    _CronAccount.observe('after save', async function (ctx, next) {
      if (ctx.isNewInstance) {
        await RoleHelper.assignTo('cron_executer', ctx.instance.id)
      }
      next()
    })
  })

  function CronAccount() {
  }
}
