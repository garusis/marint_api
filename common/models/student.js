"use strict"
import ModelBuilder from "loopback-build-model-helper"

module.exports = function(_Student) {
  let builder = new ModelBuilder(Student, _Student)

  builder.build().then(function () {
    _Student.nestRemoting("courses")
  })

  function Student() {

  }
};
