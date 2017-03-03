"use strict"
import ModelBuilder from "loopback-build-model-helper"
import app from "../../server/server"

module.exports = function(_Student) {
  let builder = new ModelBuilder(Student, _Student)

  builder.build().then(function () {
    let RoleHelper = app.models.RoleHelper

    _Student.nestRemoting("courses")

    _Student.observe('before save', function(ctx, next) {

      let instance = ctx.instance || ctx.data
      if(!ctx.isNewInstance && instance.password){
        instance.firstPassword = false
      }

      next();
    });

    _Student.observe('after save', async function (ctx, next) {
      if (ctx.isNewInstance) {
        await RoleHelper.assignTo('student', ctx.instance.id)
      }
      next()
    })

  })

  function Student() {

  }
};
