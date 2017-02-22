"use strict"
import ModelBuilder from "loopback-build-model-helper"

module.exports = function(_Student) {
  let builder = new ModelBuilder(Student, _Student)

  builder.build().then(function () {
    _Student.nestRemoting("courses")

    _Student.observe('before save', function(ctx, next) {

      let instance = ctx.instance || ctx.data
      if(!ctx.isNewInstance && instance.password){
        instance.firstPassword = false
      }

      next();
    });
  })

  function Student() {

  }
};
