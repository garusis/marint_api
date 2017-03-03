"use strict"
import ModelBuilder from "loopback-build-model-helper"
import app from "../../server/server"

module.exports = function(_Instructor) {
  let builder = new ModelBuilder(Instructor, _Instructor)

  builder.build().then(function () {
    let RoleHelper = app.models.RoleHelper

    _Instructor.observe('after save', async function (ctx, next) {
      if (ctx.isNewInstance) {
        await RoleHelper.assignTo('instructor', ctx.instance.id)
      }
      next()
    })
  })

  function Instructor () {

  }
};
